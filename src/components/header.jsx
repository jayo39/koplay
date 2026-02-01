import React, { useState, useContext } from "react";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"; // Need to install @mui/icons-material
import { Link, useNavigate } from "react-router-dom";
import { CustomHeader } from "../styles/components/header.styles";
import logo from "../assets/logo.png";
import { UserContext } from "../provider/userProvider";

const Header = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const isLoggedIn = Boolean(user);
    
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

    const allMenus = [
        { id: 1, title: '관리자 메뉴', path: '/admin', adminOnly: true, authRequired: true},
        { id: 2, title: '공지사항', path: '/news', adminOnly: false, authRequired: false},
        { id: 3, title: '게시판', path: '/post', adminOnly: false, authRequired: false},
        { id: 4, title: '프로필', path: '/profile', adminOnly: false, authRequired: true}
    ];

    const menus = allMenus.filter(menu => {
        if (menu.adminOnly) {
            return user?.role === 'ADMIN';
        }
        if (menu.authRequired) {
            return isLoggedIn;
        }
        return true;
    });

    // 로그아웃
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
        alert("로그아웃되었습니다.");
        navigate('/login');
    };

    return (
        <CustomHeader>
            <div className="header-container">
                <Link to="/">
                    <img src={logo} alt="Logo" style={{ height: '40px' }} />
                </Link>

                <div className="nav-links">
                    {menus.map((el) => (
                        <Link key={el.id} style={{ textDecoration: 'none' }} to={el.path} onClick={(e) => handleNavClick(e, el.path, el.id)}>
                            <Button style={{ color: '#000', fontSize: '16px' }}>{el.title}</Button>
                        </Link>
                    ))}
                    {!isLoggedIn ? (
                        <>
                            <Link to='/login'><Button variant="contained" color="error" disableElevation>로그인</Button></Link>
                            <Link to='/register'><Button variant="outlined" disableElevation>회원가입</Button></Link>
                        </>
                    ) : (
                        <Button variant="contained" color="secondary" onClick={handleLogout} disableElevation>로그아웃</Button>
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
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        {menus.map((el) => (
                            <MenuItem key={el.id} onClick={(e) => { handleNavClick(e, el.path, el.id); handleCloseMenu(); }}>
                                <Link to={el.path} style={{ textDecoration: 'none', color: 'inherit' }}>{el.title}</Link>
                            </MenuItem>
                        ))}
                        <hr />
                        <MenuItem onClick={handleCloseMenu}><Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>로그인</Link></MenuItem>
                        <MenuItem onClick={handleCloseMenu}><Link to="/register" style={{ textDecoration: 'none', color: 'inherit' }}>회원가입</Link></MenuItem>
                    </Menu>
                </div>
            </div>
        </CustomHeader>
    );
};

export default Header;