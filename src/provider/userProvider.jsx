import axios from 'axios';
import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode

export const UserContext = createContext(null);

const UserProvider = (props) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
            setUser(null);
            return;
        }
        try {
            const decoded = jwtDecode(token);
            setUser(decoded);
        } catch (e) {
            localStorage.removeItem('accessToken');
            setUser(null);
        }

        const verifyUser = async () => {
            try {
                let res = await axios.get('/api/auth/loggedIn', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data); 
            } catch (err) {
                localStorage.removeItem('accessToken');
                setUser(null);
                if (err.response?.data?.errno === 2) {
                    alert('세션이 만료되어 다시 로그인해 주세요.');
                }
            }
        };

        verifyUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserProvider;