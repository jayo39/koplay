import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Header from "../components/header";
import PostSideBar from "../components/postSideBar";
import CategoryTitle from "../components/categoryTitle";
import { PageMargin } from "../styles/pages/pageMargin";
import { CustomPostPage } from "../styles/pages/post.styles";
import {PostDetailContainer, CommentSection} from "../styles/components/postDetailContainer.styles"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import SendIcon from '@mui/icons-material/Send';
import { UserContext } from "../provider/userProvider";
import { Button } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import PostEditor from "../components/postEditor";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import { CommentItem, CommentListContainer } from '../styles/components/comment.styles';
import Footer from '../components/footer.jsx'
import StarIcon from '@mui/icons-material/Star'; // Add this import at the top
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-regular-svg-icons';

const PostSinglePage = () => {
    const { categoryId, postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const [commentText, setCommentText] = useState("");
    const [commentAnonymous, setCommentAnonymous] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [replyAnonymous, setReplyAnonymous] = useState(false);


    const fetchPostDetail = async () => {
        try {
            const res = await axios.get(`/api/post/${categoryId}/${postId}?userId=${user?.id || ''}`);
            setPost(res.data);
        } catch (err) {
            console.error("게시글 상세 조회 실패", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCommentSubmit = async () => {
        if (!user) {
            alert("로그인이 필요합니다.");
            return;
        }
        if (!commentText.trim()) return;

        try {
            await axios.post(`/api/post/${postId}/comment`, {
                content: commentText,
                userId: user.id,
                isAnonymous: commentAnonymous ? 1 : 0
            });
            
            setCommentText("");
            fetchPostDetail();
        } catch (err) {
            alert("댓글 작성에 실패했습니다.");
        }
    };

    useEffect(() => {
        fetchPostDetail();
    }, [postId, user?.id]);

    const handleCommentDelete = async (commentId) => {
        if (window.confirm("이 댓글을 삭제하시겠습니까?")) {
            try {
                await axios.delete(`/api/post/comment/${commentId}`);
                fetchPostDetail();
            } catch (err) {
                alert("댓글 삭제에 실패했습니다.");
            }
        }
    };

    const handleCommentLike = async (commentId) => {
        if (!user) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            const updatedComments = post.comments.map(c => {
                if (c.id === commentId) {
                    const isLiked = !c.isLiked;
                    return {
                        ...c,
                        isLiked: isLiked,
                        like_count: isLiked ? (c.like_count || 0) + 1 : (c.like_count || 1) - 1
                    };
                }
                return c;
            });
            setPost({ ...post, comments: updatedComments });

            await axios.post(`/api/post/comment/${commentId}/like`, { userId: user.id });
        } catch (err) {
            fetchPostDetail();
        }
    };

    const handleReplySubmit = async (parentId) => {
        if (!user) {
            alert("로그인이 필요합니다.");
            return;
        }
        if (!replyText.trim()) return;

        try {
            await axios.post(`/api/post/${postId}/comment`, {
                content: replyText,
                userId: user.id,
                isAnonymous: replyAnonymous ? 1 : 0,
                parentId: parentId // Send the parent ID to the backend
            });
            
            setReplyText("");
            setReplyingTo(null); // Close the reply input
            fetchPostDetail();
        } catch (err) {
            alert("대댓글 작성에 실패했습니다.");
        }
    };
    
    const handleUpdateSuccess = () => {
        setIsEditing(false);
        fetchPostDetail(); 
    };

    const handleLike = async () => {
        if (!user) {
            alert("로그인이 필요합니다.");
            return;
        }
        try {
            const previouslyLiked = post.isLiked;
            setPost({
                ...post,
                isLiked: !previouslyLiked,
                like_count: previouslyLiked ? post.like_count - 1 : post.like_count + 1
            });

            await axios.post(`/api/post/${postId}/like`, { userId: user.id });
            
        } catch (err) {
            alert("좋아요 처리에 실패했습니다.");
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("이 글을 삭제하시겠습니까?");
        
        if (confirmDelete) {
            try {
                await axios.delete(`/api/post/${postId}`);
                
                navigate(`/`);
            } catch (err) {
                alert("게시글 삭제에 실패했습니다.");
            }
        }
    };

    const handleScrap = async () => {
    if (!user) {
        alert("로그인이 필요합니다.");
        return;
    }

    try {
        const previouslyScrapped = post.isScrapped;
        setPost({
            ...post,
            isScrapped: !previouslyScrapped,
            scrap_count: previouslyScrapped ? (post.scrap_count || 1) - 1 : (post.scrap_count || 0) + 1
        });

        await axios.post(`/api/post/${postId}/scrap`, { userId: user.id });

    } catch (err) {
        // If server fails, revert the UI by fetching details again
        console.error("스크랩 처리에 실패했습니다.", err);
        fetchPostDetail();
        alert("스크랩 처리에 실패했습니다.");
    }
};

    if (loading) return null;

    const isAuthor = user && post && user.id === post.user_id;

    return (
        <>
            <Header />
            <PageMargin>
                <div style={{ display: 'flex', width: '100%', gap: '25px', alignItems: 'flex-start' }}>
                    <CustomPostPage>
                        <CategoryTitle name={post?.categoryName || '게시판'} />
                        
                        {isEditing ? (
                            <>
                                <PostEditor 
                                    initialData={post}
                                    isEditMode={true} 
                                    onSave={handleUpdateSuccess} 
                                    onCancel={() => setIsEditing(false)} 
                                />
                                <Button variant="outlined" style={{color: '#f91f15', borderColor: '#f91f15', width: 'fit-content', height: 'fit-content'}} onClick={() => setIsEditing(false)} disableElevation><ArrowBackIosIcon style={{fontSize: 'medium'}}/>글 수정 취소</Button>
                            </>
                        ) : (
                            <PostDetailContainer>
                                <div className="post-header">
                                    <AccountCircleIcon className="profile-icon" />
                                    <div className="author-info">
                                        <div className="name">{post?.author}</div>
                                        <div className="date">{new Date(post?.created_at).toLocaleString()}</div>
                                    </div>
                                    <div className="post-actions">
                                        {isAuthor ? (
                                            <>
                                                <span onClick={() => setIsEditing(true)} style={{cursor: 'pointer'}}>수정</span>
                                                <span onClick={handleDelete} style={{cursor: 'pointer'}}>삭제</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>쪽지</span>
                                                <span>신고</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <h2 className="post-title">{post?.title}</h2>
                                <p className="post-content">{post?.content}</p>

                                <div className="post-stats">
                                    <div className="stat-item red"><ThumbUpOffAltIcon /> {post?.like_count}</div>
                                    <div className="stat-item blue"><FontAwesomeIcon icon={faComment} style={{ fontSize: '13px', color: '#7393B3' }} /> {post?.comments?.length || 0}</div>
                                    <div className="stat-item yellow"><StarBorderIcon/>{post?.scrap_count || 0}</div>
                                </div>
                                <div className="button-group">
                                    <button 
                                        className={`action-btn ${post?.isLiked ? 'active' : ''}`} 
                                        onClick={handleLike}
                                        style={{ color: post?.isLiked ? '#f91f15' : 'inherit' }}
                                    >
                                        {post?.isLiked ? <ThumbUpIcon fontSize="small" /> : <ThumbUpOffAltIcon fontSize="small" />}
                                        공감
                                    </button>

                                    {/* Updated Scrap Button */}
                                    <button 
                                        className={`action-btn ${post?.isScrapped ? 'active' : ''}`}
                                        onClick={handleScrap}
                                        style={{ color: post?.isScrapped ? '#ffbb00' : 'inherit' }} // Yellow color for scraps
                                    >
                                        {post?.isScrapped ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />} 
                                        스크랩
                                    </button>
                                </div>
                            </PostDetailContainer>
                        )}

                        {!isEditing && (
                            <>
                                <CommentListContainer>
                                    {(post?.comments || []).map((comment) => {
                                        const isCommentAuthor = user && user.id === comment.user_id;
                                        const isPostWriter = post.user_id === comment.user_id;
                                        const isReply = comment.parent_id !== null;

                                        return (
                                            <React.Fragment key={comment.id}>
                                                <CommentItem isReply={isReply}>
                                                    <div className="comment-header">
                                                        <div className="comment-author">
                                                            {isReply && <SubdirectoryArrowRightIcon className="reply-icon" fontSize="small" />}
                                                            <AccountCircleIcon className="profile-icon" />
                                                            <span className="name" style={{ color: isPostWriter ? '#f91f15' : 'inherit' }}>
                                                                {comment.author}
                                                            </span>
                                                        </div>
                                                        <div className="comment-actions">
                                                            {!isReply && <span onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} style={{cursor: 'pointer'}}>대댓글</span>}
                                                            <span onClick={() => handleCommentLike(comment.id)} style={{ color: comment.isLiked ? '#f91f15' : 'inherit', cursor: 'pointer' }}>
                                                                공감 {comment.like_count > 0 ? comment.like_count : ''}
                                                            </span>
                                                            {isCommentAuthor ? (
                                                                <span onClick={() => handleCommentDelete(comment.id)} style={{ cursor: 'pointer' }}>삭제</span>
                                                            ) : (
                                                                <><span>쪽지</span><span>신고</span></>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="comment-content">{comment.content}</div>
                                                    <div className="comment-date" style={{display: 'flex'}}>
                                                        {new Date(comment.created_at).toLocaleString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}
                                                        {comment.like_count > 0 && 
                                                            <div className="comment-like-count" style={{display: 'flex', alignItems: 'center'}}>
                                                                <ThumbUpOffAltIcon style={{ fontSize: '13px', margin: '0 1px 0 7px', color: '#f91f15' }} />
                                                                <div>{comment.like_count}</div>
                                                            </div>}
                                                    </div>
                                                </CommentItem>

                                                {replyingTo === comment.id && (
                                                    <CommentSection style={{ padding: '10px 20px', backgroundColor: '#f9f9f9', borderRadius: '0px', borderRight: '0px', borderLeft: '0px', borderTop: '1px solid #e3e3e3', borderBottom: '1px solid #e3e3e3' }}>
                                                        <div className="comment-input-wrapper">
                                                            <input 
                                                                placeholder="대댓글을 입력하세요." 
                                                                value={replyText} 
                                                                onChange={(e) => setReplyText(e.target.value)}
                                                                onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit(comment.id)}
                                                                autoFocus
                                                            />
                                                            <div className="input-actions">
                                                                <label><input type="checkbox" checked={replyAnonymous} onChange={(e) => setReplyAnonymous(e.target.checked)}/> 익명</label>
                                                                <button className="submit-comment" onClick={() => handleReplySubmit(comment.id)}><SendIcon /></button>
                                                            </div>
                                                        </div>
                                                    </CommentSection>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </CommentListContainer>
                                <CommentSection>
                                    <div className="comment-input-wrapper">
                                        <input placeholder="댓글을 입력하세요." value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}/>
                                        <div className="input-actions">
                                            <label><input type="checkbox" onChange={(e) => setCommentAnonymous(e.target.checked)}/> 익명</label>
                                            <button className="submit-comment" checked={commentAnonymous} onClick={handleCommentSubmit}><SendIcon /></button>
                                        </div>
                                    </div>
                                </CommentSection>
                                <Button variant="outlined" style={{color: '#f91f15', borderColor: '#f91f15', width: 'fit-content', height: 'fit-content'}} disableElevation onClick={()=> {navigate(`/post/${categoryId}`)}}><ListIcon/>글 목록</Button>
                            </>
                        )}
                    </CustomPostPage>
                    <PostSideBar />
                </div>
            </PageMargin>
            <Footer></Footer>
        </>
    );
};

export default PostSinglePage;