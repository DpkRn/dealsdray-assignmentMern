import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/auth-context';


function Login() {
    const navigate = useNavigate()
    const { Authenticate } = useAuth()
    const [login, setLogin] = useState(true)

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading,setLoading]=useState(false)

    const handleLogin = async (e) => {

        e.preventDefault();
        setLoading(true)
        const url = login ? "http://localhost:8080/api/login" : "http://localhost:8080/api/signup"
        try {
            const response = await axios.post(url, {
                username,
                password,
            });
            if (login) {
               if(response.data.success){
                alert(response.data.msg);
                localStorage.setItem("auth", true)
                localStorage.setItem("user",response.data.user.username)
               
                Authenticate();
                navigate('/')
               }
                
            }
            else {
                if(response.data.success){
                    alert(response.data.msg);
                    setLogin(state=>!state)
                     
                }

            }
            

        } catch (error) {
           const message=error.response?.data?.msg||"server error"
           alert(message)
        }finally{
            setLoading(false);
        }


    };

    return (
        <div class="login-box">
            {login ? <h2>Login</h2> : <h2>Signup</h2>}
            <form onSubmit={handleLogin}>
                <div class="user-box">
                    <input type="text" name="" required="" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <label>Username</label>
                </div>
                <div class="user-box">
                    <input type="password" name="" required="" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <label>Password</label>
                </div>
                <button type='submit' className='bg-slate-200 px-4 py-1 rounded-md hover:bg-slate-400' >{`${login ? (isLoading?"...":"Login") :(isLoading)?"...":"Signup"}`}</button>
                <div className='mt-2'>
                    {login ? <p>New User? <span className='underline text-blue-600 cursor-pointer' onClick={() => setLogin(false)}>click here</span></p> : <p>Already have an Account? <span className='underline text-blue-600 cursor-pointer' onClick={() => setLogin(true)}>click here</span></p>}
                </div>
            </form>
        </div>
    );
}

export default Login;
