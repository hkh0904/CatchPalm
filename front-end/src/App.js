// import './App.css'; // 필요한 경우 주석을 제거하고 사용하세요.
import React, { useEffect, useState } from 'react';
import style from "./App.module.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import PlayingPage from './pages/PlayingPage';
import ChatRoomItem from "./components/ChatRoomComponents/ChatRoomItem";
import ChatRoomList from "./components/ChatRoomComponents/ChatRoomList"; // chat 리스트방으로
import { Button, Drawer } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Userinfo from './pages/Userinfo';
import Tutorial from './pages/Tutorial';
import RankingPage from './pages/RankingPage';
import axios from 'axios';


function MainPage() {
    
  const navigate = useNavigate();

  ////////로그인 로그아웃 시작////////////////
  const isLoggedIn = !!localStorage.getItem('token'); 
  // const isLoggedIn = 1;  // 로그인 토큰 확인


  const handleLogout = () => {
    localStorage.removeItem('token'); // 토큰 삭제
    window.location.reload(); // 페이지 갱신
  };

  
    //// 내 정보보기 시작
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerOpen = () => {
      setDrawerOpen(!drawerOpen);
    };

    /// 내정보 보기 끝


  const handleButtonClick3 = () => {
    navigate('/login');
  };
  
  const handleButtonClick4 = () => {
    navigate('/signup');
  };
  ////////////// 로그인 로그아웃 끝////////////////  


  //////// 회원정보 받아오기 시작/////////
  const [userId, setUserId] = useState(null);
  const token = localStorage.getItem('token');


  useEffect(() => {
    if(!token) return;  // 토큰이 없으면 요청하지 않습니다.
    axios({
      method: 'get',
      url: 'https://localhost:8443/api/v1/users/me',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // your access token here
      }
    })
      .then(response => {
        const rawUserId = response.data.userId;
        const cleanedUserId = rawUserId.replace('local:', ''); // 앞에 local: 지우기
        setUserId(cleanedUserId);
        localStorage.setItem('userData', JSON.stringify(response.data));
        console.log(response.data)
      })
      .catch(error => {
        const token = error.response.headers.authorization.slice(7);
        localStorage.setItem('token', token);
        axios({
          method: 'get',
          url: 'https://localhost:8443/api/v1/users/me',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // your access token here
          }
        })
          .then(response => {
            const rawUserId = response.data.userId;
            const cleanedUserId = rawUserId.replace('local:', ''); // 앞에 local: 지우기
            setUserId(cleanedUserId);
            localStorage.setItem('userData', JSON.stringify(response.data));
            console.log(response.data)
          })
          .catch(error => {
            console.log(error);
          })
      });
  }, [token]); // useEffect will run once when the component mounts
  

///////회원정보 받아오기 끝////////////  
  const handleButtonClick = () => {
    navigate('/Playing');
  };
  
  return (
    <React.Fragment>

      <video autoPlay muted loop className={`${style.background_video}`}>
        <source src="assets/background.mp4" type="video/mp4" />
      </video>

      <div className={style.mainword}>
        <h2>당신의 손으로 리듬을 잡아라</h2>
      </div>
          {isLoggedIn ? (
            <React.Fragment>
            <div className={style.gamemode} container spacing={2}>
              
                <a href="tutorial">
                  
                  <span></span>
                  <span></span>
                  <span></span>
                  튜토리얼
                </a>
                <a href="/Playing">
                  
                  <span></span>
                  <span></span>
                  <span></span>
                  SOLO MODE
                </a>
                <a href="/ChatRoomList">
                  
                  <span></span>
                  <span></span>
                  <span></span>
                  MULTI MODE
                </a>
              </div>
              <button variant="contained" onClick={handleButtonClick}>
                Go to Sample Page
              </button>
              <br />
              <button onClick={handleButtonClick}>게임시작</button>
              <div className={`${style.logout}`}>
                <button onClick={handleLogout}>
                  로그아웃
                </button>
              </div>
              <div className={`${style.userinfo}`}>
                <button onClick={handleDrawerOpen}>
                  회원정보
                </button>
              </div>
              
              <div className={`${style.white_text}`}>
                <p>아이디: {userId}</p>
              </div>

              <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerOpen}>
                <Userinfo />
              </Drawer>
              
            </React.Fragment>
          ) : (
          <React.Fragment>
              <div className={`${style.login}`}>
                <button onClick={handleButtonClick3}>
                  로그인
                </button>
              </div>
              <div className={`${style.signup}`}>
                <button onClick={handleButtonClick4}>
                  회원가입
                </button>
              </div>
          </React.Fragment>
          )}
        
    </React.Fragment>
  );
}

function App() {
  
  return (
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/userinfo" element={<Userinfo />} />
          <Route path="/Playing" element={<PlayingPage />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/chatRoomList" element={<ChatRoomList onSelectChatRoom={undefined} />} />
          <Route path="/chat-rooms/:roomNumber" element={<ChatRoomItem />} />
          <Route path="/ranking" element={<RankingPage />} />
        </Routes>
    </Router>
  );
}

export default App;