import express from 'express';
import pool from '../db.js';
import { loginRequired } from '../lib/utils.js';

const router = express.Router();

router.get('/newest', async (req, res) => {
    try {
        const [posts] = await pool.query(`
            SELECT 
                p.id, p.title, p.category_id, p.created_at,
                CASE WHEN p.isAnonymous = 1 THEN '익명' ELSE u.name END as author,
                (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as like_count
            FROM posts p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
            LIMIT 5
        `);
        res.json(posts);
    } catch (err) {
        res.status(500).json({ msg: "사이드바 데이버 불러오기 실패." });
    }
});

router.get('/popular', async (req, res) => {
    // 디폴트로 3개 보여주기
    const limit = parseInt(req.query.limit) || 5;

    try {
        const [posts] = await pool.query(`
            SELECT 
                p.id, p.title, p.category_id, p.created_at,
                CASE WHEN p.isAnonymous = 1 THEN '익명' ELSE u.name END as author,
                (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as like_count,
                (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count,
                (SELECT COUNT(*) FROM saved_posts WHERE post_id = p.id) as save_count,
                (
                    ( 
                      (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) * 1 + 
                      (SELECT COUNT(*) FROM comments WHERE post_id = p.id) * 2 +
                      (SELECT COUNT(*) FROM saved_posts WHERE post_id = p.id) * 3
                    ) 
                    / POWER(TIMESTAMPDIFF(HOUR, p.created_at, NOW()) + 2, 1.5)
                ) AS hot_score
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.created_at >= NOW() - INTERVAL 7 DAY
            ORDER BY hot_score DESC
            LIMIT ?
        `, [limit]);
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "인기 게시글 불러오기 실패." });
    }
});

router.get('/category/:id', async (req, res) => {
    const { id } = req.params;
    const page = req.query.page;
    
    try {
        if (!page) {
            // 메인 페이지
            const [posts] = await pool.query(
                `SELECT p.*, u.name as author FROM posts p 
                 JOIN users u ON p.user_id = u.id 
                 WHERE p.category_id = ? 
                 ORDER BY p.created_at DESC LIMIT 4`, 
                [id]
            );
            return res.status(200).json(posts);
        } else {
            // 게시판 페이지
            const currentPage = parseInt(page) || 1;
            const limit = 10;
            const offset = (currentPage - 1) * limit;

            const [posts] = await pool.query(
                `SELECT 
                    p.*, 
                    CASE 
                        WHEN p.isAnonymous = 1 THEN '익명' 
                        ELSE u.name 
                    END as author,
                    (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as like_count,
                    (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
                FROM posts p 
                JOIN users u ON p.user_id = u.id 
                WHERE p.category_id = ? 
                ORDER BY p.created_at DESC LIMIT ? OFFSET ?`, 
                [parseInt(id), limit, offset]
            );

            const [countResult] = await pool.query(
                `SELECT COUNT(*) as total FROM posts WHERE category_id = ?`, 
                [id]
            );
            const total = countResult[0]?.total || 0;

            const [catResult] = await pool.query(
                `SELECT name FROM categories WHERE id = ?`, 
                [id]
            );
            const categoryName = catResult[0]?.name || "알 수 없는 게시판";

            return res.status(200).json({ posts, total, categoryName });
        }
    } catch (err) {
        res.status(500).json({ msg: 'Internal Server Error', error: err.message });
    }
});

router.post('/write', loginRequired, async(req, res) => {
    const { title, content, categoryId, isAnonymous } = req.body;
    const userId = req.loginId;
    try {
        const sql = `
            INSERT INTO posts 
            (title, content, user_id, category_id, isAnonymous, view_count, created_at) 
            VALUES (?, ?, ?, ?, ?, 0, NOW())
        `;

        const [result] = await pool.query(sql, [
            title, 
            content, 
            userId, 
            categoryId, 
            isAnonymous
        ]);

        res.status(200).json({ msg: "글 쓰기 성공.", postId: result.insertId });
    } catch (err) {
        res.status(500).json({ msg: "글 작성 실패. 서버 오류." });
    }
});

router.get('/:categoryId/:postId', async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.query;
    try {
        const [postRows] = await pool.query(`
            SELECT p.*, c.name as categoryName,
            CASE WHEN p.isAnonymous = 1 THEN '익명(글쓴이)' ELSE u.name END as author,
            (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as like_count,
            (SELECT COUNT(*) FROM saved_posts WHERE post_id = p.id) as scrap_count,
            EXISTS(SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = ?) as isLiked,
            EXISTS(SELECT 1 FROM saved_posts WHERE post_id = p.id AND user_id = ?) as isScrapped
            FROM posts p
            JOIN users u ON p.user_id = u.id
            JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `, [userId || null, userId || null, postId]);
        
        if (postRows.length === 0) return res.status(404).json({ msg: "게시글을 찾을 수 없습니다." });

        const postAuthorId = postRows[0].user_id;

        const [commentRows] = await pool.query(`
            SELECT 
                c.*, 
                u.name as real_name,
                (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id) as like_count,
                EXISTS(SELECT 1 FROM comment_likes WHERE comment_id = c.id AND user_id = ?) as isLiked,
                CASE 
                    WHEN c.isAnonymous = 0 THEN u.name
                    WHEN c.user_id = ? THEN '익명(글쓴이)'
                    ELSE CONCAT('익명', (
                        SELECT user_rank 
                        FROM (
                            SELECT user_id, ROW_NUMBER() OVER (ORDER BY MIN(created_at) ASC) as user_rank
                            FROM comments 
                            WHERE post_id = ? AND user_id != ? AND isAnonymous = 1
                            GROUP BY user_id
                        ) as ranks 
                        WHERE ranks.user_id = c.user_id
                    ))
                END as author
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = ?
            ORDER BY COALESCE(c.parent_id, c.id) ASC, c.created_at ASC
        `, [userId || null, postAuthorId, postId, postAuthorId, postId]);

        res.json({ 
            ...postRows[0], 
            isLiked: !!postRows[0].isLiked, 
            isScrapped: !!postRows[0].isScrapped,
            comments: commentRows 
        });
        
    } catch (err) {
        res.status(500).json({ msg: "서버 오류" });
    }
});

router.post('/:postId/like', loginRequired, async (req, res) => {
    const { postId } = req.params;
    const userId = req.loginId;

    if (!userId) return res.status(401).json({ msg: "로그인이 필요합니다." });

    try {
        const [existing] = await pool.query(
            "SELECT id FROM post_likes WHERE user_id = ? AND post_id = ?",
            [userId, postId]
        );

        if (existing.length > 0) {
            await pool.query("DELETE FROM post_likes WHERE user_id = ? AND post_id = ?", [userId, postId]);
            return res.status(200).json({ liked: false, msg: "좋아요 취소" });
        } else {
            await pool.query("INSERT INTO post_likes (user_id, post_id) VALUES (?, ?)", [userId, postId]);
            return res.status(200).json({ liked: true, msg: "좋아요 성공" });
        }
    } catch (err) {
        res.status(500).json({ msg: "서버 오류" });
    }
});

router.put('/:postId', loginRequired, async (req, res) => {
    const { title, content, isAnonymous } = req.body;
    const userId = req.loginId;
    try {
        await pool.query(
            "UPDATE posts SET title = ?, content = ?, isAnonymous = ? WHERE id = ? AND user_id = ?",
            [title, content, isAnonymous, req.params.postId, userId]
        );
        res.json({ msg: "수정 성공" });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:postId', loginRequired, async (req, res) => {
    const { postId } = req.params;
    const userId = req.loginId;
    
    try {
        const [result] = await pool.query("DELETE FROM posts WHERE id = ? AND user_id = ?", [postId, userId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: "삭제할 게시글을 찾을 수 없습니다." });
        }
        
        res.status(200).json({ msg: "게시글 삭제 성공" });
    } catch (err) {
        res.status(500).json({ msg: "서버 오류로 삭제에 실패했습니다." });
    }
});

router.post('/:postId/comment', loginRequired, async (req, res) => {
    const { postId } = req.params;
    const { content, isAnonymous, parentId } = req.body;
    const userId = req.loginId;

    if (!content || !userId) {
        return res.status(400).json({ msg: "내용과 사용자 ID가 필요합니다." });
    }

    try {
        await pool.query(
            "INSERT INTO comments (post_id, user_id, content, isAnonymous, parent_id, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
            [postId, userId, content, isAnonymous, parentId || null]
        );
        res.status(200).json({ msg: "댓글 작성 성공" });
    } catch (err) {
        res.status(500).json({ msg: "서버 오류", error: err.message });
    }
});

router.delete('/comment/:commentId', loginRequired, async (req, res) => {
    const { commentId } = req.params;
    const userId = req.loginId;
    try {
        await pool.query("DELETE FROM comments WHERE id = ? AND user_id = ?", [commentId, userId]);
        res.status(200).json({ msg: "댓글 삭제 성공" });
    } catch (err) {
        res.status(500).json({ msg: "서버 오류" });
    }
});

router.post('/comment/:commentId/like', loginRequired, async (req, res) => {
    const { commentId } = req.params;
    const userId = req.loginId;

    try {
        const [existing] = await pool.query(
            "SELECT id FROM comment_likes WHERE user_id = ? AND comment_id = ?",
            [userId, commentId]
        );

        if (existing.length > 0) {
            await pool.query("DELETE FROM comment_likes WHERE user_id = ? AND comment_id = ?", [userId, commentId]);
            res.json({ liked: false });
        } else {
            await pool.query("INSERT INTO comment_likes (user_id, comment_id) VALUES (?, ?)", [userId, commentId]);
            res.json({ liked: true });
        }
    } catch (err) {
        res.status(500).json({ msg: "서버 오류" });
    }
});

router.post('/:postId/scrap', loginRequired, async (req, res) => {
    const { postId } = req.params;
    const userId = req.loginId;

    if (!userId) return res.status(401).json({ msg: "로그인이 필요합니다." });

    try {
        const [existing] = await pool.query(
            "SELECT id FROM saved_posts WHERE user_id = ? AND post_id = ?",
            [userId, postId]
        );

        if (existing.length > 0) {
            await pool.query("DELETE FROM saved_posts WHERE user_id = ? AND post_id = ?", [userId, postId]);
            return res.status(200).json({ scrapped: false, msg: "스크랩 취소" });
        } else {
            await pool.query("INSERT INTO saved_posts (user_id, post_id) VALUES (?, ?)", [userId, postId]);
            return res.status(200).json({ scrapped: true, msg: "스크랩 성공" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "서버 오류" });
    }
});

router.get('/favorite', loginRequired, async (req, res) => {
    const userId = req.loginId
    if (!userId) return res.status(401).json({ msg: "로그인이 필요합니다." });

    try {
        const [posts] = await pool.query(`
            SELECT 
                p.*, 
                c.name as categoryName,
                CASE WHEN p.isAnonymous = 1 THEN '익명' ELSE u.name END as author,
                (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as like_count,
                (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
            FROM posts p
            JOIN saved_posts s ON p.id = s.post_id
            JOIN users u ON p.user_id = u.id
            JOIN categories c ON p.category_id = c.id
            WHERE s.user_id = ?
        `, [userId]);

        res.json(posts);
    } catch (err) {
        console.error(err); // This will show the specific error in your terminal
        res.status(500).json({ msg: "스크랩 목록을 불러오는데 실패했습니다.", error: err.message });
    }
});

router.get('/wrote', loginRequired, async (req, res) => {
    const userId = req.loginId;
    try {
        const [posts] = await pool.query(`
            SELECT p.*, c.name as categoryName,
            (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as like_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count,
            CASE WHEN p.isAnonymous = 1 THEN '익명' ELSE u.name END as author
            FROM posts p
            JOIN categories c ON p.category_id = c.id
            JOIN users u ON p.user_id = u.id
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC
        `, [userId]);
        res.json(posts);
    } catch (err) { res.status(500).json(err); }
});

router.get('/commented', loginRequired, async (req, res) => {
    const userId = req.loginId;
    try {
        const [posts] = await pool.query(`
            SELECT DISTINCT p.*, c.name as categoryName,
            (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as like_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count,
            CASE WHEN p.isAnonymous = 1 THEN '익명' ELSE u.name END as author
            FROM posts p
            JOIN comments com ON p.id = com.post_id
            JOIN categories c ON p.category_id = c.id
            JOIN users u ON p.user_id = u.id
            WHERE com.user_id = ?
            ORDER BY p.created_at DESC
        `, [userId]);
        res.json(posts);
    } catch (err) { res.status(500).json(err); }
});

export default router;