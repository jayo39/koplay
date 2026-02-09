import { Link } from "react-router-dom";
import { CustomRankingTable } from "../styles/components/rankingTable.styles";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RankingTable = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [popularPosts, setPopularPosts] = useState([]);

    useEffect(() => {
        // 실시간 시간
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // 인기글 10개
        const fetchPopular = async () => {
            try {
                const res = await axios.get('/api/post/popular?limit=10');
                setPopularPosts(res.data);
            } catch (err) {
                console.error("Ranking data fetch failed", err);
            }
        };

        fetchPopular();
        return () => clearInterval(timer);
    }, []);

    const formatDateTime = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    };

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <CustomRankingTable>
                <div className="header">
                    <div className="header-title">
                        <div>
                            <h2>실시간 인기 글</h2>
                        </div>
                        <div>{formatDateTime(currentTime)} 기준</div>
                    </div>
                </div>
                
                <div className="list-wrapper">
                    {popularPosts.map((post, index) => (
                        <div className="row" key={post.id} style={{ opacity: post.isFaded ? 0.3 : 1 }}>
                            <div className="rank">{index + 1}</div>
                            <div className="content">{post.title}</div>
                            <div className="status">
                                {"HOT"}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="fade-overlay" />

                <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="footer-button">
                        실시간 인기 글 자세히보기
                    </div>
                </Link>
            </CustomRankingTable>
        </div>
    );
}

export default RankingTable;