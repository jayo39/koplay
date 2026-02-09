import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const PostCategory = ({name, categoryId}) => {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`/api/post/category/${categoryId}`);
                setPosts(res.data);
            } catch(err) {
                console.error(`${name} 게시글 로딩 실패`);
            }
        }

        if (categoryId) fetchPosts();
    }, [categoryId, name]);

    return (
        <TableContainer component={Paper} style={{ boxShadow: 'none', border: '1px solid #e0e0e0'}}>
            <Table aria-label="post table">
                <TableHead style={{ backgroundColor: '#f8f9fa'}}>
                    <TableRow>
                        <TableCell className="table-title" sx={{ 
                            color: '#f91f15', 
                            fontWeight: 'bold', 
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                color: '#b3150f', 
                                backgroundColor: 'rgba(0, 0, 0, 0.04)', 
                            }
                        }} onClick={() => navigate(`/post/${categoryId}`)}>{name}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {posts.map((post) => (
                        <TableRow key={post.id} hover style={{ cursor: 'pointer' }} onClick={() => navigate(`/post/${categoryId}/${post.id}`)}>
                            <TableCell>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>
                                            {post.title.length > 20 
                                                ? `${post.title.slice(0, 20)}...` 
                                                : post.title}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#888' }}>
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default PostCategory;