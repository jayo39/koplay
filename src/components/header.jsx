import React, { useState, useContext, useEffect } from "react";
import { Box, Button, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CustomHeader } from "../styles/components/header.styles";
import logo from "../assets/logo.png";
import { UserContext } from "../provider/userProvider";
import EmailIcon from '@mui/icons-material/Email';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Badge } from "@mui/material";
import axios from "axios";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser, loading: authLoading, refreshFriends } = useContext(UserContext);
    const isLoggedIn = Boolean(user);
    
    const [anchorEl, setAnchorEl] = useState(null);
    const [userAnchorEl, setUserAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const userMenuOpen = Boolean(userAnchorEl);

    const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

    const handleOpenUserMenu = (event) => setUserAnchorEl(event.currentTarget);
    const handleCloseUserMenu = () => setUserAnchorEl(null);

    const [pendingRequests, setPendingRequests] = useState([]);
    const [notifAnchorEl, setNotifAnchorEl] = useState(null);

    const allMenus = [
        { id: 1, title: '관리자 메뉴', path: '/admin', adminOnly: true, authRequired: true},
        { id: 2, title: '게시판', path: '/post/1', adminOnly: false, authRequired: true},
        { id: 3, title: '시간표', path: '/schedule', adminOnly: false, authRequired: true},
        { id: 4, title: '학점계산기', path: '/gpa', adminOnly: false, authRequired: true},
        { id: 5, title: '친구', path: '/friend', adminOnly: false, authRequired: true},
        { id: 6, title: '서비스 소개', path: '/', adminOnly: false, authRequired: false, unauthOnly: true},
        { id: 7, title: '개인정보 보호', path: '/privacy', adminOnly: false, authRequired: false, unauthOnly: true}
    ];

    const menus = allMenus.filter(menu => {
        // 관리자 전용
        if (menu.adminOnly && user?.role !== 'ADMIN') return false;

        // 로그인 전용
        if (menu.authRequired && !isLoggedIn) return false;

        // 게스트 전용
        if (menu.unauthOnly && isLoggedIn) return false;

        return true;
    });

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
        handleCloseUserMenu();
        handleCloseMenu();
        navigate('/login');
    };

    useEffect(() => {
        const fetchPending = async () => {
            if (authLoading) return;
            const token = user?.accessToken || localStorage.getItem('accessToken');
            if (!token) return;

            try {
                const res = await axios.get("/api/friend/pending", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPendingRequests(res.data);
            } catch (err) {
                console.error("Failed to fetch notifications", err);
            }
        };

        fetchPending();
        const interval = setInterval(fetchPending, 30000);
        return () => clearInterval(interval);
    }, [user, authLoading]);

    const handleRespond = async (requesterId, action) => {
        const token = user?.accessToken || localStorage.getItem('accessToken');
        if (!token) {
            alert("세션이 만료되었습니다. 다시 로그인해주세요.");
            return;
        }
        try {
            await axios.put(
                "/api/friend/respond",
                { requesterId, action },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setPendingRequests((prev) => 
                prev.filter((req) => req.requester_id !== requesterId)
            );

            if (action === 'accepted') {
                alert("친구 요청을 수락했습니다.");
                refreshFriends();
            }
        } catch (error) {
            console.error("Error responding to friend request:", error);
            alert("요청 처리에 실패했습니다.");
        }
    };

    const handleOpenNotif = (event) => setNotifAnchorEl(event.currentTarget);
    const handleCloseNotif = () => setNotifAnchorEl(null);

    return (
        <CustomHeader>
            <div className="header-container">
                <div className="left-section">
                    <Link to="/" style={{width: 'fit-content'}} className="logo-link">
                        <img src={logo} alt="Logo" style={{ height: '40px', display: 'block'}} />
                    </Link>

                    <div className="nav-links">
                        {menus.map((el) => {
                            const isActive = el.path.startsWith('/post') 
                                ? location.pathname.startsWith('/post') 
                                : location.pathname === el.path;

                            return (
                                <Link key={el.id} style={{ textDecoration: 'none' }} to={el.path}>
                                    <Button 
                                        style={{ 
                                            color: isActive ? '#f91f15' : '#000',
                                            fontSize: '16px',
                                            fontWeight: isActive ? '700' : '600',
                                            borderBottom: isActive ? '3px solid #f91f15' : '3px solid transparent',
                                            borderRadius: 0,
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {el.title}
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="right-section">
                    <div className="auth-links">
                        {!isLoggedIn ? (
                            <>
                                <Link to='/login'>
                                    <Button variant="contained" style={{backgroundColor: '#f91f15'}} disableElevation>로그인</Button>
                                </Link>
                                <Link to='/register'>
                                    <Button variant="outlined" disableElevation>회원가입</Button>
                                </Link>
                            </>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <IconButton style={{ padding: '8px' }} component={Link} to="/message">
                                    <EmailIcon style={{ fontSize: '28px', color: '#666' }} />
                                </IconButton>

                                <IconButton onClick={handleOpenNotif} style={{ padding: '8px' }}>
                                    <Badge badgeContent={pendingRequests.length} color="error">
                                        <NotificationsIcon style={{ fontSize: '28px', color: '#666' }} />
                                    </Badge>
                                </IconButton>
                                <Menu
                                    anchorEl={notifAnchorEl}
                                    open={Boolean(notifAnchorEl)}
                                    onClose={handleCloseNotif}
                                    disableScrollLock={true}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                >
                                    {pendingRequests.length === 0 ? (
                                        <MenuItem style={{ fontSize: '14px', color: '#888' }}>
                                            새로운 알림이 없습니다.
                                        </MenuItem>
                                    ) : (
                                        pendingRequests.map((req) => (
                                            <Box 
                                                key={req.requester_id} 
                                                style={{ 
                                                    display: 'flex', 
                                                    flexDirection: 'column', 
                                                    alignItems: 'flex-start',
                                                    padding: '12px 16px',
                                                    borderBottom: '1px solid #eee'
                                                }}
                                            >
                                                <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                                                    <b>{req.name}</b>({req.username})님이 친구 요청을 보냈습니다.
                                                </div>
                                                
                                                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                                                    <Button 
                                                        variant="contained" 
                                                        size="small"
                                                        disableElevation
                                                        style={{ flex: 1, fontSize: '12px', backgroundColor: '#f91f15' }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRespond(req.requester_id, 'accepted');
                                                        }}
                                                    >
                                                        수락
                                                    </Button>
                                                    <Button 
                                                        variant="outlined" 
                                                        size="small"
                                                        color="error"
                                                        style={{ flex: 1, fontSize: '12px', color: '#000', borderColor: '#e0e0e0' }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRespond(req.requester_id, 'rejected');
                                                        }}
                                                    >
                                                        거절
                                                    </Button>
                                                </div>
                                            </Box>
                                        ))
                                    )}
                                </Menu>

                                <IconButton onClick={handleOpenUserMenu} style={{ padding: 0 }}>
                                    <AccountCircleIcon style={{ fontSize: '40px', color: '#666' }} />
                                </IconButton>

                                <Menu
                                    anchorEl={userAnchorEl}
                                    open={userMenuOpen}
                                    onClose={handleCloseUserMenu}
                                    disableScrollLock={true}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                >
                                    <MenuItem onClick={() => { navigate('/profile'); handleCloseUserMenu(); }}>
                                        내 정보
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout} style={{ color: '#f91f15' }}>
                                        로그아웃
                                    </MenuItem>
                                </Menu>
                            </div>
                        )}
                    </div>

                    <div className="mobile-menu-icon">
                        <IconButton onClick={handleOpenMenu}>
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleCloseMenu}
                            disableScrollLock={true}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                            {menus.map((el) => (
                                <MenuItem 
                                    key={el.id} 
                                    onClick={handleCloseMenu}
                                    style={{ color: location.pathname === el.path ? '#f91f15' : 'inherit' }}
                                >
                                    <Link to={el.path} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                                        {el.title}
                                    </Link>
                                </MenuItem>
                            ))}
                            
                            <hr style={{ border: '0.5px solid #eee', margin: '8px 0' }} />

                            {!isLoggedIn ? (
                                [
                                    <MenuItem key="login" onClick={handleCloseMenu}>
                                        <Link to="/login" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>로그인</Link>
                                    </MenuItem>,
                                    <MenuItem key="register" onClick={handleCloseMenu}>
                                        <Link to="/register" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>회원가입</Link>
                                    </MenuItem>
                                ]
                            ) : (
                                <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
                            )}
                        </Menu>
                    </div>
                </div>
            </div>
        </CustomHeader>
    );
};

export default Header;