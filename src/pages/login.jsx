import { CustomLoginPage } from "../styles/pages/login.styles";
import logo from "../assets/logo.png";
import { object, string } from "yup";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import FooterLinks from "../components/footerLink";
import { useContext } from "react";
import {UserContext} from "../provider/userProvider";
import {jwtDecode} from "jwt-decode";
import axios from "axios";

const loginSchema = object({
    username: string().required('필수 항목입니다.'),
    pw: string().required('필수 항목입니다')
});

const LoginPage = () => {

    const navigate = useNavigate();
    const {setUser} = useContext(UserContext);

    const formik = useFormik({
        initialValues: {
            username: '',
            pw: ''
        },
        onSubmit: async() => {
            try {
                let res = await axios.post('/api/auth/login', {
                    username: formik.values.username,
                    pw: formik.values.pw
                });
                const token = res.data.accessToken;
                localStorage.setItem('accessToken', token);
                const decoded = jwtDecode(token);
                setUser(decoded);
                alert('로그인되었습니다.');
                navigate('/', { replace: true });
            } catch(err) {
                alert(err.response?.data?.msg || '로그인 실패');
            }
        },
        validationSchema: loginSchema
    });

    return (
        <div>
            <CustomLoginPage>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div>
                                <img src={logo} alt="Logo" style={{ height: '48px', display: 'block'}} />
                            </div>
                        </div>
                        <form onSubmit={formik.handleSubmit} style={{display: 'flex', flexDirection: 'column', width: '400px', gap: '12px', marginTop: '2rem'}}>

                                <input name="username" value={formik.values.username} onChange={formik.handleChange} placeholder="아이디"></input>

                                <input name="pw" value={formik.values.pw} onChange={formik.handleChange} placeholder="비밀번호" type={'password'}></input>

                                <Button type="submit" style={{borderRadius: '15px', backgroundColor: '#f91f15', color: '#fff', width: '100%', height: '54px'}}>텔레그노시스 로그인</Button>

                                <Link to="/register">
                                    <Button variant="outlined" style={{borderRadius: '15px', borderColor: '#ededed', color: '#737373', width: '100%', height: '54px'}}>회원가입</Button>
                                </Link>

                            <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '8px'}}>
                                <Link to="/forgot" style={{fontSize: '16px', color: '#666', cursor: 'pointer'}}>아이디/비밀번호 찾기</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </CustomLoginPage>
            <div style={{marginTop: '5rem'}}>
                <FooterLinks></FooterLinks>
            </div>
        </div>
    )
}

export default LoginPage;