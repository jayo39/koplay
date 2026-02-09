import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box } from '@mui/material';
import { CustomPostSideBar } from '../styles/components/postSideBar';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const PostSideBar = () => {

    const [popularPosts, setPopularPosts] = useState([]);
    const [newestPosts, setNewestPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSidebarData = async () => {
            try {
                const [popularRes, newestRes] = await Promise.all([
                    axios.get('/api/post/popular'),
                    axios.get('/api/post/newest')
                ]);
                
                setPopularPosts(popularRes.data);
                setNewestPosts(newestRes.data);
            } catch (err) {
                console.error("사이드바 데이터 불러오기 실패", err);
            }
        };
        fetchSidebarData();
    }, []);

    const renderPostRow = (post) => (
        <TableRow 
            key={post.id} 
            hover 
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/post/${post.category_id}/${post.id}`)}
        >
            <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>
                        {post.title.length > 20 
                            ? `${post.title.slice(0, 20)}...` 
                            : post.title}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#888' }}>
                        <Typography variant="caption">{post.author}</Typography>
                        <Typography variant="caption">
                            {new Date(post.created_at).toLocaleDateString('en-US', { 
                                year: 'numeric', month: 'numeric', day: 'numeric' 
                            })}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px', marginLeft: 'auto' }}>
                            <ThumbUpOffAltIcon 
                                sx={{ 
                                    fontSize: '14px', 
                                    color: post.like_count > 0 ? '#f91f15' : '#888' 
                                }} 
                            />
                            {post.like_count > 0 && (
                                <Typography 
                                    variant="caption" 
                                    sx={{ color: '#f91f15', fontWeight: 'bold' }}
                                >
                                    {post.like_count}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
            </TableCell>
        </TableRow>
    );

    return (
        <CustomPostSideBar>
            {/* Real-time Popular Posts */}
            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                <Table aria-label="popular post table">
                    <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                        <TableRow>
                            <TableCell className="table-title">실시간 인기 글</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {popularPosts.length > 0 ? (
                            popularPosts.map((post) => renderPostRow(post))
                        ) : (
                            <TableRow><TableCell><Typography variant="caption">인기 게시글이 없습니다.</Typography></TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Newest Posts */}
            <TableContainer component={Paper} sx={{ marginTop: '25px', boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                <Table aria-label="newest post table">
                    <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                        <TableRow>
                            <TableCell className="table-title">최신 글</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {newestPosts.map((post) => renderPostRow(post))}
                    </TableBody>
                </Table>
            </TableContainer>
        </CustomPostSideBar>
    );
}

export default PostSideBar;