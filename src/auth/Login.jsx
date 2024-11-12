import Cookies from "js-cookie";
import { API_ServerLiveStream, BASE_API_URL } from "../env.dev";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [dataForm, setDataForm] = useState({
        username: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChangeData = (e) => {
        setDataForm({
            ...dataForm,
            [e.target.name]: e.target.value
        })
    }

    const handleSignin = async (e) => {
        e.preventDefault();

        try {
            const url = `${BASE_API_URL}${API_ServerLiveStream.USER_SIGNIN}`;
            console.log(url)
            const res = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(dataForm),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if(res.ok){
                const dataRes = await res.json();
                const payload = dataRes.payload;
                console.log(dataRes)
                Cookies.set('accessToken', dataRes.accessToken);
                Cookies.set('payload', payload);
                
                if(payload?.role === 'creator'){
                    return navigate('/creator');
                } else if(payload?.role === 'user'){
                    return navigate('/viewer');
                }
            }

            return alert('Lỗi quá trình đăng nhập!');
        } catch (error) {
            console.log('Signin Error: ', error);
        }
    }

    return(
        <div>
            <form action="" onSubmit={handleSignin}>
                <h1>Trang đăng nhập</h1>
                <label htmlFor="">Username: </label>
                <input type="text" name="username" value={dataForm.username} onChange={handleChangeData} />
                <label htmlFor="">Mật khẩu: </label>
                <input type="password" name="password" value={dataForm.password} onChange={handleChangeData} />
                <button>Đăng nhập</button>
            </form>
        </div>
    )
}

export const sendReq = async (url, options = {}) => {
    const accessToken = Cookies.get('accessToken');

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    };

    return fetch(url, {
        ...options,
        headers,
    });
};

export default Login;