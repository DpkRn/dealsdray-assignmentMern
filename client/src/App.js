import React, { useEffect, useState } from 'react';
import {  Route, Link, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Home from './Home';
import EmployeeList from './EmployeeList';
import AddEmployee from './AddEmployee';
import Login from './Login';
import { useAuth } from './context/auth-context';
import { toast, ToastContainer } from "react-toastify";

function PrivateRoute({children}){
    const {isAdmin} =useAuth();
    if(isAdmin)
        return children;
        else 
        return <Navigate to='/login'/>
    
}
function AuthRoute({children}){
    const {isAdmin}=useAuth()
    if(!isAdmin)
        return children;
        else 
    return <Navigate to='/'/>
    
}


function App() {
    const navigate=useNavigate()
    const location=useLocation();
    const {isAdmin,Authenticate,LogOut}=useAuth();
    const [username,setUsername]=useState(localStorage.getItem("user"))
    

    useEffect(()=>{
        
        if(localStorage.getItem("auth")){
            Authenticate();
            setUsername(localStorage.getItem("user"))
        }
        else {
            LogOut();
            
        }
    },[isAdmin,username])

    const handleLogOut=()=>{
        localStorage.removeItem("auth")
        LogOut()
        navigate('/login',{replace:false})
        
    }
    
    return (
       
            <div className='bg-slate-200 min-h-screen'>
                {isAdmin&&<nav className='flex justify-between bg-blue-600 text-white p-4 font-semibold shadow-lg items-center'>
                    <ul className='flex gap-4'>
                        <li className={`${location.pathname==='/'?"font-extrabold":""}`}><Link to="/">Home</Link></li>
                        <li className={`${location.pathname==='/employees'?"font-extrabold":""}`}><Link to="/employees">Employee List</Link></li>
                    </ul>

                    <div className='flex gap-4'>
                    <span>{username}</span>
                    <button onClick={handleLogOut} className='bg-black/80 px-3 py-1 rounded-md shadow-lg'>Logout</button>
                    </div>
                </nav>}
                <div className='p-4'>
                <Routes>
                    <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                    <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
                    <Route path="/employees" element={<PrivateRoute><EmployeeList /></PrivateRoute>} />
                    <Route path="/add-employee" element={<PrivateRoute><AddEmployee /></PrivateRoute>} />
                </Routes>
                </div>
                <ToastContainer/>
            </div>
        
    );
}

export default App;
