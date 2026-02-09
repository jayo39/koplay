import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { UserContext } from "../provider/userProvider";
import CategoryTitle from "../components/categoryTitle";
import Footer from "../components/footer";
import Header from "../components/header";
import PostSideBar from "../components/postSideBar";
import { PageMargin } from "../styles/pages/pageMargin";
import { CustomPostPage, PostItemContainer } from "../styles/pages/post.styles";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-regular-svg-icons';

const PostPersonalPage = () => {
    const { type } = useParams(); // 'favorite', 'posts', or 'comments'
    const [posts, setPosts] = useState([]);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const pageConfig = {
        favorite: { title: '내 스크랩', endpoint: '/api/post/favorite', emptyMsg: '스크랩한 글이 없습니다.' },
        posts: { title: '내가 쓴 글', endpoint: '/api/post/wrote', emptyMsg: '작성한 글이 없습니다.' },
        comments: { title: '댓글 단 글', endpoint: '/api/post/commented', emptyMsg: '댓글을 단 글이 없습니다.' }
    };

    const currentConfig = pageConfig[type] || pageConfig.favorite;

    useEffect(() => {
        const fetchPosts = async () => {
            if (!user) return;
            try {
                const res = await axios.get(`${currentConfig.endpoint}?userId=${user.id}`);
                setPosts(res.data);
            } catch (err) {
                console.error("데이터 가져오기 실패.", err);
            }
        };
        fetchPosts();
    }, [user, type]); 

    return (
        <>
            <Header />
            <PageMargin>
                <div style={{ display: 'flex', width: '100%', gap: '25px', alignItems: 'flex-start' }}>
                    <CustomPostPage>
                        <CategoryTitle name={currentConfig.title} />
                        
                        {posts.map((post) => (
                            <PostItemContainer 
                                key={post.id} 
                                onClick={() => navigate(`/post/${post.category_id}/${post.id}`)}
                            >
                                <div className="category-label">{post.categoryName}</div>
                                <div className="post-title">{post.title}</div>
                                <div className="post-preview">
                                    {post.content.length > 25 ? `${post.content.substring(0, 25)}...` : post.content}
                                </div>
                                <div className="post-meta">
                                    <span className="stat-red"><ThumbUpOffAltIcon style={{fontSize: 14}}/> {post.like_count}</span>
                                    <span className="stat-blue"><FontAwesomeIcon icon={faComment} style={{ fontSize: '13px', color: '#7393B3' }} /> {post.comment_count}</span>
                                    <span className="meta-text">{new Date(post.created_at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}</span>
                                    <span className="meta-text">{post.author}</span>
                                </div>
                            </PostItemContainer>
                        ))}

                        {posts.length === 0 && (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                                {currentConfig.emptyMsg}
                            </div>
                        )}
                    </CustomPostPage>
                    <PostSideBar />
                </div>
            </PageMargin>
            <Footer />
        </>
    );
};

export default PostPersonalPage;