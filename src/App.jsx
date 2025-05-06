import { useState , useEffect } from 'react'
import React  from 'react';
import './App.css'
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingPage from './pages/SettingPage';
import ProfilePage from './pages/ProfilePage';
import { Routes , Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import   {Loader} from 'lucide-react';
import {Toaster} from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore';
function App() {
  const [count, setCount] = useState(0)
  const {authUser , checkAuth , isCheckingAuth , onlineUsers} = useAuthStore();
    const  {theme}= useThemeStore();
useEffect(()=>{
  checkAuth();
}
,[checkAuth]);

if(isCheckingAuth && !authUser) 
  return <div className='flex justify-center items-center h-screen'>
<Loader className="size-10 animate-spin" ></Loader>
  </div>
  return (
  <div data-theme = {theme}>
  <Navbar  />

  <Routes>
    <Route path='/' element={authUser ?   <HomePage/> :  <Navigate to ="/login"/>  } />
    <Route path='/signup' element={!authUser ? <SignUpPage/> : <Navigate to ="/"/>    } />
    <Route path='/login' element={!authUser ?   <LoginPage/>  : <Navigate to ="/"/>  }  />
    <Route path='/settings' element={<SettingPage/>} />
    <Route path='/profile' element={ authUser ?  <ProfilePage/> :  <Navigate to ="/login"/>} />
    
  </Routes>
  <Toaster />
  </div>
  )
}

export default App
