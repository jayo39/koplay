import {useFormik} from "formik";
import { object, ref, string } from "yup";
import { CustomRegisterPage } from "../styles/pages/register.styles";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button, Menu } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";


const registerSchema = object({
    name: string().required('필수 항목입니다'),
    email: string().required('필수 항목입니다').email('올바른 이메일 형식이 아닙니다'),
    username: string().required('필수 항목입니다').max(30, '아이디는 30글자 이하여야 합니다.'),
    pw: string().required('필수 항목입니다').min('4', '비밀번호는 최소 4자 이상 입력해 주세요.'),
    pwCheck: string().required('필수 항목입니다').oneOf([ref('pw'), null], '비밀번호가 일치하지 않습니다.').min('4', '비밀번호는 최소 4자 이상 입력해 주세요.')
});

const RegisterPage = () => {

    const navigate = useNavigate();

    const [schools, setSchools] = useState([]);

    // 학교 목록 가져오기
    useEffect(() => {
        const getSchools = async () => {
            try {
                const res = await axios.get('/api/school/list');
                setSchools(res.data.schoolList);
            } catch(err) {
                console.error('학교 목록 불러오기 실패.', err);
            }
        };
        getSchools();
    }, []);

    const formik = useFormik({
        initialValues: {
            school: '',
            name: '',
            email: '',
            username: '',
            pw: '',
            pwCheck: ''
        },
        onSubmit: async() => {
            try {
                await axios.post('/api/auth/register', {
                    username: formik.values.username,
                    pw: formik.values.pw,
                    name: formik.values.name,
                    school: formik.values.school,
                    email: formik.values.email
                });
                alert('회원가입이 완료되었습니다.');
                navigate('/login', {replace: true});
            } catch(err) {
                alert(err.response.data.msg);
            }
        },
        validationSchema: registerSchema
    });


    return (
        <CustomRegisterPage>
            <div style={{display: 'flex', justifyContent: 'center', padding: '0 20px'}}>
                <Card variant="outlined" style={{width: '780px', padding: '20px'}}>
                    <CardContent style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                        <div style={{fontSize: '22px', fontWeight: 'bold', marginBottom: '12px'}}>텔레그노시스 회원가입</div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ 
                                fontSize: '14px', 
                                color: '#374151', 
                                backgroundColor: '#fef2f2', 
                                padding: '12px', 
                                borderRadius: '10px',
                                border: '1px solid #fee2e2',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span style={{ fontSize: '18px' }}>🎓</span>
                                <span>
                                    학교를 선택하시면 학교 전용 <strong>뱃지</strong>를 획득하실 수 있습니다!
                                </span>
                            </div>
                        </div>
                        <form style={{display: 'flex', flexDirection: 'column', gap: '8px' }} onSubmit={formik.handleSubmit}>
                            <FormControl fullWidth>
                                <Select
                                    name="school"
                                    displayEmpty
                                    value={formik.values.school}
                                    onChange={formik.handleChange}
                                    renderValue={(selected) => {
                                        if (selected.length === 0) {
                                            return <span style={{ color: '#9ca3af' }}>학교를 선택해주세요</span>;
                                        }
                                        const selectedSchool = schools.find((s) => s.id === selected);
                                        return selectedSchool ? selectedSchool.name : selected;
                                    }}
                                    style={{
                                        borderRadius: '15px',
                                        height: '54px',
                                        backgroundColor: '#fff',
                                        border: '2px solid #eeeeee',
                                        paddingLeft: '10px',
                                        fontSize: '14px',
                                        fontWeight: '600'
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-notchedOutline': {border: 'none'},
                                        '& .MuiSelect-select': {display: 'flex', alignItems: 'center'}
                                    }}
                                >
                                    <MenuItem disabled value="">
                                        <em>학교를 선택해주세요</em>
                                    </MenuItem>
                                    {schools?.map((s) => (
                                        <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <input name="name" placeholder="*이름" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}></input>
                            {formik.touched.name && formik.errors.name && <div style={{color: 'red', fontSize: '14px', fontWeight: '500'}}>*{formik.errors.name}</div>}
                            <input name="email" placeholder="*이메일" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}></input>
                            {formik.touched.email && formik.errors.email && <div style={{color: 'red', fontSize: '14px', fontWeight: '500'}}>*{formik.errors.email}</div>}
                            <input name="username" placeholder="*아이디" value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur}></input>
                            {formik.touched.username && formik.errors.username && <div style={{color: 'red', fontSize: '14px', fontWeight: '500'}}>*{formik.errors.username}</div>}
                            <input name="pw" placeholder="*비밀번호" value={formik.values.pw} type={'password'} onChange={formik.handleChange} onBlur={formik.handleBlur}></input>
                            {formik.touched.pw && formik.errors.pw && <div style={{color: 'red', fontSize: '14px', fontWeight: '500'}}>*{formik.errors.pw}</div>}
                            <input name="pwCheck" placeholder="*비밀번호 확인" value={formik.values.pwCheck} type={'password'} onChange={formik.handleChange} onBlur={formik.handleBlur}></input>
                            {formik.touched.pwCheck && formik.errors.pwCheck && <div style={{color: 'red', fontSize: '14px', fontWeight: '500'}}>*{formik.errors.pwCheck}</div>}
                            <div style={{ fontSize: '13px', color: '#9ca3af', textAlign: 'end'}}>* 필수항목</div>
                            <Button type="submit" style={{borderRadius: '15px', backgroundColor: '#f91f15', color: '#fff', width: '100%', height: '54px'}}>회원가입</Button>
                        </form>
                    </CardContent>
                </Card>
                
            </div>
        </CustomRegisterPage>
    )
}

export default RegisterPage;