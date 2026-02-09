import express from 'express';
import pool from '../db.js';
import { loginRequired } from '../lib/utils.js'

const router = express.Router();

router.get('/', loginRequired, async (req, res) => {
    const requesterId = req.loginId;
    const targetId = req.query.userId;

    if (!targetId) return res.status(400).json({ error: "알 수 없는 아이디." });

    try {
        const isOwner = parseInt(requesterId) === parseInt(targetId);
        
        if (!isOwner) {
            const [friendship] = await pool.query(
                `SELECT 1 FROM friendships 
                 WHERE status = 'accepted' 
                 AND ((requester_id = ? AND addressee_id = ?) 
                      OR (requester_id = ? AND addressee_id = ?))`,
                [requesterId, targetId, targetId, requesterId]
            );

            if (friendship.length === 0) {
                return res.status(403).json({ error: "친구만 시간표를 볼 수 있습니다." });
            }
        }

        let sql = 'SELECT * FROM schedules WHERE user_id = ?';
        const params = [targetId];

        if (!isOwner) {
            sql += " AND privacy = 'friends'";
        }

        const [schedules] = await pool.query(sql, params);
        res.json(schedules);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/items/:scheduleId', loginRequired, async (req, res) => {
    const { scheduleId } = req.params;
    const requesterId = req.loginId;

    try {
        const [schedule] = await pool.query('SELECT user_id, privacy FROM schedules WHERE id = ?', [scheduleId]);
        if (schedule.length === 0) return res.status(404).json({ error: "시간표가 없습니다." });

        const { user_id: ownerId, privacy } = schedule[0];

        if (privacy === 'me' && requesterId !== ownerId) {
            return res.status(403).json({ error: "비공개 시간표입니다." });
        }

        const [items] = await pool.query('SELECT * FROM schedule_items WHERE schedule_id = ?', [scheduleId]);
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/add', loginRequired, async (req, res) => {
    const { schedule_id, name, location, day, start_time, end_time, color } = req.body;
    const userId = req.loginId;
    
    try {
        const [schedule] = await pool.query('SELECT id FROM schedules WHERE id = ? AND user_id = ?', [schedule_id, userId]);
        if (schedule.length === 0) return res.status(403).json({ msg: "권한이 없습니다." });

        const sql = `
            INSERT INTO schedule_items 
            (schedule_id, name, location, day, start_time, end_time, color) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(sql, [schedule_id, name, location, day, start_time, end_time, color]);
        
        res.status(200).json({ id: result.insertId, msg: "일정이 추가되었습니다." });
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ msg: "서버 오류로 저장하지 못했습니다." });
    }
});

router.delete('/:id', loginRequired, async (req, res) => {
    const userId = req.loginId;
    try {
        // Check ownership via JOIN with schedules table
        const [item] = await pool.query(
            `SELECT si.id FROM schedule_items si 
             JOIN schedules s ON si.schedule_id = s.id 
             WHERE si.id = ? AND s.user_id = ?`, 
            [req.params.id, userId]
        );

        if (item.length === 0) return res.status(403).json({ msg: "삭제 권한이 없습니다." });

        await pool.query("DELETE FROM schedule_items WHERE id = ?", [req.params.id]);
        res.status(200).json({ msg: "삭제 성공." });
    } catch (err) {
        res.status(500).json({ msg: "삭제 실패." });
    }
});

router.put('/:id', loginRequired, async (req, res) => {
    const { name, location, day, start_time, end_time, color } = req.body;
    const userId = req.loginId;
    try {
        const [item] = await pool.query(
            `SELECT si.id FROM schedule_items si 
             JOIN schedules s ON si.schedule_id = s.id 
             WHERE si.id = ? AND s.user_id = ?`, 
            [req.params.id, userId]
        );

        if (item.length === 0) return res.status(403).json({ msg: "수정 권한이 없습니다." });

        await pool.query(
            `UPDATE schedule_items 
             SET name=?, location=?, day=?, start_time=?, end_time=?, color=? 
             WHERE id=?`,
            [name, location, day, start_time, end_time, color, req.params.id]
        );
        res.json({ msg: "수정 성공" });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/create-folder', loginRequired, async (req, res) => {
    const { name, privacy } = req.body;
    const userId = req.loginId;

    if (!name) {
        return res.status(400).json({ error: "시간표 이름을 입력해주세요." });
    }

    try {
        const sql = `
            INSERT INTO schedules (user_id, name, privacy) 
            VALUES (?, ?, ?)
        `;
        // privacy defaults to 'me' if not provided
        const [result] = await pool.query(sql, [userId, name, privacy || 'me']);
        
        res.status(200).json({ 
            id: result.insertId, 
            msg: "새 시간표가 생성되었습니다." 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 시간표를 생성하지 못했습니다." });
    }
});

router.put('/folder/:id', loginRequired, async (req, res) => {
    const { name, privacy, is_default } = req.body;
    const scheduleId = req.params.id;
    const userId = req.loginId;

    try {
        if (is_default) {
            await pool.query('UPDATE schedules SET is_default = 0 WHERE user_id = ?', [userId]);
        }

        const sql = `UPDATE schedules SET name = ?, privacy = ?, is_default = ? WHERE id = ? AND user_id = ?`;
        await pool.query(sql, [name, privacy, is_default ? 1 : 0, scheduleId, userId]);

        res.json({ msg: "설정이 저장되었습니다." });
    } catch (err) {
        res.status(500).json({ error: "설정 저장 실패" });
    }
});

router.delete('/folder/:id', loginRequired, async (req, res) => {
    const scheduleId = req.params.id;
    const userId = req.loginId;

    try {
        const [check] = await pool.query('SELECT 1 FROM schedules WHERE id = ? AND user_id = ?', [scheduleId, userId]);
        if (check.length === 0) return res.status(403).json({ error: "권한이 없습니다." });

        await pool.query('DELETE FROM schedules WHERE id = ?', [scheduleId]);
        res.json({ msg: "시간표가 삭제되었습니다." });
    } catch (err) {
        res.status(500).json({ error: "삭제 실패" });
    }
});

export default router;