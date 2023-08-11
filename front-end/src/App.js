// import './App.css'; // 필요한 경우 주석을 제거하고 사용하세요.
import React, { useEffect, useState } from 'react';
import style from "./App.module.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import PlayingPage from './pages/PlayingPage';
import ChatRoomItem from "./pages/ChatRoomPage";
import ChatRoomList from "./components/ChatRoomComponents/ChatRoomList"; // chat 리스트방으로
import { Button, Drawer } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Userinfo from './pages/Userinfo';
import Tutorial from './pages/Tutorial';
import RankingPage from './pages/RankingPage';
import ResultPage from './pages/ResultPage';
import axios from 'axios';
import APPLICATION_SERVER_URL from './ApiConfig';

//const APPLICATION_SERVER_URL = process.env.NODE_ENV === 'https://i9c206.p.ssafy.io/api' ? '' : 'https://localhost:8443';

function MainPage() {

  // 메인 버튼
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
    
  const navigate = useNavigate();

  ////////로그인 로그아웃 시작////////////////
  const isLoggedIn = !!localStorage.getItem('token'); 
  // const isLoggedIn = 1;  // 로그인 토큰 확인


  const handleLogout = () => {
    localStorage.removeItem('token'); // 토큰 삭제
    window.location.reload(); // 페이지 갱신
  };

    // 버튼 클릭 상태를 추적하는 useState 추가
    const [buttonClicked, setButtonClicked] = useState(false);  

    const handleCircleButtonClick = () => {
      setButtonClicked(true);
    }
    //// 내 정보보기 시작
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerOpen = () => {
      setDrawerOpen(!drawerOpen);
    };

    /// 내정보 보기 끝


  // const handleButtonClick3 = () => {
  //   navigate('/login');
  // };
  
  const handleButtonClick4 = () => {
    navigate('/signup');
  };
  ////////////// 로그인 로그아웃 끝////////////////  

  ////로그인 회원가임 Drawer

    // 드로어 내용을 결정할 useState 추가
    const [drawerContent, setDrawerContent] = useState(null);

    const openLoginDrawer = () => {
        setDrawerContent("login");
        handleDrawerOpen();
    };

    const openSignupDrawer = () => {
        setDrawerContent("signup");
        handleDrawerOpen();
    };


  //////// 회원정보 받아오기 시작/////////
  const [userId, setUserId] = useState(null);
  const token = localStorage.getItem('token');


  useEffect(() => {
    if(!token) return;  // 토큰이 없으면 요청하지 않습니다.
    axios({
      method: 'get',
      url: `${APPLICATION_SERVER_URL}/api/v1/users/me`,
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
          url: `${APPLICATION_SERVER_URL}/api/v1/users/me`,
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
  
  const buttonClasses = isHovered ? style.button + ' ' + style.hovered : style.button;

  return (
    <React.Fragment>
        {/* background_video에 클릭 상태에 따른 클래스 조건부 추가 */}
        <video 
          autoPlay muted loop 
          className={`${style.background_video} ${buttonClicked ? style.clicked : ""}`}
        >
          <source src="assets/background.mp4" type="video/mp4" />
        </video>

      <div className={style.mainword}>
        <h2>당신의 손으로 리듬을 잡아라</h2>
      </div>
      {/* 메인버튼 */}
      <div>
      <button
        className={buttonClasses}
        onMouseEnter={handleHover}
        onMouseLeave={handleMouseLeave}
      >
        <p className={style.main_font}>Catch Palm</p>
      </button>
    </div>
          {isLoggedIn ? (
            <React.Fragment>
            <div className={style.gamemode} container spacing={2}>
              
                <a href="tutorial" className={style.a}>
                  
                  <span></span>
                  <span></span>
                  <span></span>
                  TUTORIAL
                </a>
                <a href="/Playing" className={style.a}>
                  
                  <span></span>
                  <span></span>
                  <span></span>
                  SOLO MODE
                </a>
                <a href="/ChatRoomList" className={style.a}>
                  
                  <span></span>
                  <span></span>
                  <span></span>
                  MULTI MODE
                </a>
                <a href="/ranking" className={style.a}>
                  
                  <span></span>
                  <span></span>
                  <span></span>
                  ranking
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
            <div className={style.gamemode} container spacing={2}>
              <a href="#" className={style.a} onClick={openLoginDrawer}>              
                <span></span>
                <span></span>
                <span></span>
                LOGIN
              </a>
              <a href="#" className={style.a} onClick={openSignupDrawer}>
                
                <span></span>
                <span></span>
                <span></span>
                SIGN UP
              </a>
            </div>
            
              {/* <div className={`${style.login}`}>
                <button onClick={handleDrawerOpen}>
                  로그인
                </button>
              </div>
              <div className={`${style.signup}`}>
                <button onClick={handleButtonClick4}>
                  회원가입
                </button>
              </div> */}
              {/* <button 
                className={`${style.centeredCircleButton} ${buttonClicked ? style.clicked : ""}`} 
                onClick={handleCircleButtonClick}
              >
              </button> */}
              <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerOpen}>
                {drawerContent === "login" && <Login />}
                {drawerContent === "signup" && <SignUp />}
              </Drawer>
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
          <Route path="/result" element={<ResultPage />} />
        </Routes>
    </Router>
  );
}

export default App;