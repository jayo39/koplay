import SearchBar from "../components/searchBar";
import React, { useState, useRef, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CustomPostPage, WritePostBar } from "../styles/pages/post.styles";
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button, Typography, Box } from '@mui/material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PostSideBar from "../components/postSideBar";
import { PageMargin } from "../styles/pages/pageMargin";
import PostEditor from "../components/postEditor";
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { Pagination } from '@mui/material';
import Header from "../components/header";
import axios from '../api/axios';
import CategoryTitle from "../components/categoryTitle";
import Footer from '../components/footer.jsx'
import { UserContext } from "../provider/userProvider";
import { faComment } from '@fortawesome/free-regular-svg-icons';

const PostPage = () => {
    const { categoryId } = useParams();
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [categoryName, setCategoryName] = useState("로딩 중...");
    const postsPerPage = 10;
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const navigate = useNavigate();
    const { user } = useContext(UserContext);


    const handleDataRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
        setPage(1);
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`/api/post/category/${categoryId}?page=${page}`);
                
                setPosts(res.data.posts);
                setTotalPosts(res.data.total);
                if (res.data.categoryName) {
                    setCategoryName(res.data.categoryName);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchPosts();
    }, [categoryId, page, refreshTrigger]);

    const handleChange = (event, value) => {
        setPage(value);
        window.scrollTo(0, 0);
    };

    const [isWriting, setIsWriting] = useState(false);
    const editorRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isWriting && editorRef.current && !editorRef.current.contains(event.target)) {
                setIsWriting(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isWriting]);

    return (
        <>
            <Header></Header>
            <PageMargin>
                <div style={{display: 'flex', width: '100%', gap: '25px', alignItems: 'flex-start'}}>
                    <CustomPostPage>
                        <CategoryTitle name={categoryName}/>
                        {!isWriting ? (
                            <WritePostBar onClick={() => setIsWriting(true)}>
                                <span>새 글을 작성해주세요!</span>
                                <FontAwesomeIcon icon={faPencil} className="pencil-icon" />
                            </WritePostBar>
                        ) : (
                            <div ref={editorRef}>
                                <PostEditor onSave={handleDataRefresh} onCancel={() => setIsWriting(false)} />
                            </div>                    )}
                        <div style={{display: 'flex', justifyContent: 'end'}}>  
                            <SearchBar></SearchBar>
                        </div>
                        <TableContainer component={Paper} style={{boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                            <Table aria-label="post table">
                                <TableBody>
                                    {posts.map((post) => (
                                        <TableRow key={post.id} hover style={{ cursor: 'pointer' }} onClick={() => navigate(`/post/${categoryId}/${post.id}`)}>
                                            <TableCell style={{fontWeight: 'bold', paddingLeft: '20px'}}>{post.title}</TableCell>
                                            <TableCell align="center">
                                                {post.author}
                                            </TableCell>
                                            <TableCell align="center">
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                                                    <ThumbUpOffAltIcon sx={{ fontSize: '18px', color: '#f91f15' }} />
                                                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#f91f15' }}>
                                                        {post.like_count || 0}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                                                    <FontAwesomeIcon 
                                                        icon={faComment} 
                                                        style={{ fontSize: '15px', color: '#7393B3' }} 
                                                    />
                                                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#7393B3' }}>
                                                        {post.comment_count || 0}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 2 }}>
                            <Pagination 
                                count={Math.ceil(totalPosts / postsPerPage) || 1}
                                page={page} 
                                onChange={handleChange} 
                                variant="outlined" 
                                shape="rounded"
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        fontFamily: '"Pretendard", sans-serif',
                                        fontWeight: 'bold',
                                        fontSize: '13px',
                                    },
                                    '& .Mui-selected': {
                                        backgroundColor: '#f91f15 !important',
                                        color: '#fff !important',
                                        border: 'none',
                                    },
                                    '& .MuiPaginationItem-root:hover': {
                                        backgroundColor: '#f5f5f5',
                                    }
                                }}
                            />
                        </Box>
                    </CustomPostPage>
                    <PostSideBar></PostSideBar>
                </div>
            </PageMargin>
            <Footer></Footer>
        </>
    )
}

export default PostPage;