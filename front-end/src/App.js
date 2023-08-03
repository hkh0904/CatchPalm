// import './App.css'; // 필요한 경우 주석을 제거하고 사용하세요.
import React, { useEffect, useState } from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import PlayingPage from './pages/PlayingPage';
import ChatRoomItem from "./components/ChatRoomItem";
import ChatRoomList from "./components/ChatRoomList"; // chat 리스트방으로
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Userinfo from './pages/Userinfo';


import axios from 'axios';

function MainPage() {
  const navigate = useNavigate();


  ////////로그인 로그아웃 시작////////////////
  const isLoggedIn = !!localStorage.getItem('token');  // 로그인 토큰 확인
 

  const handleLogout = () => {
    localStorage.removeItem('token'); // 토큰 삭제
    
    window.location.reload(); // 페이지 갱신
  };
  const handleDeleteAccount = () => {
    // Confirmation before account deletion
    if (!window.confirm('정말로 회원 탈퇴를 진행하시겠습니까?')) {
      return; // If user cancels (clicks 'No'), stop the function
    }
    
    const token = localStorage.getItem('token');
    
    
    fetch('https://localhost:8443/api/v1/users/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // or however your server expects the token
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Error during account deletion');
      }
    })
    .then(data => {
      // Handle successful deletion here, such as by logging out the user
      localStorage.removeItem('token');
      window.location.reload();
    })
    .catch(error => {
      // Handle any errors here
      console.error('Error:', error);
    });
  };
  
  


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
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []); // useEffect will run once when the component mounts
  

///////회원정보 받아오기 끝////////////  
  const handleButtonClick = () => {
    navigate('/Playing');
  };

  const handleButtonClick2 = () => {
    navigate('/ChatRoomList');
  };
// 회원정보 조회 시작 //
  const handleButtonClick6 = () => {
    navigate('/userinfo');
  };

// 회원정보 조회 끝 //



  
  return (
    <React.Fragment>
      <Grid className="mainGrid" container spacing={2}>
        <Grid item xs={4} md={8} lg={8}>
        {isLoggedIn ? (  // 로그인 상태일 때만 버튼을 보여줍니다.
            <React.Fragment>
              <Button variant="contained" onClick={handleButtonClick}>
                Go to Sample Page
              </Button>
              <br />
              <br />
              
                <Button variant="contained" onClick={handleButtonClick2}>
                  채팅방리스트로 가기
                </Button>
                <Button variant="contained" onClick={handleButtonClick6}>
                  회원정보조회
                </Button>

              
                <Button variant="contained" onClick={handleLogout}>
                  로그아웃
                </Button>
                <Button variant="contained" onClick={handleDeleteAccount}>
                  회원 탈퇴
                </Button>
              <h1>로그인 된 메인페이지</h1>
              <p>아이디: {userId}</p>
              
            </React.Fragment>
          ) : ( // 로그인이 안되어 있을 때는 메시지를 보여줍니다.
          <React.Fragment>
              <Button variant="contained" onClick={handleButtonClick3}>
                로그인
              </Button> 
              <Button variant="contained" onClick={handleButtonClick4}>
                회원가입
              </Button>       
              <h1>로그인 X 메인페이지</h1>
              
            </React.Fragment>
          )}
        </Grid>
      </Grid>
    </React.Fragment>

  );
}

function App() {
  return (
    <Router>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="userinfo" element={<Userinfo />} />

        
        <Route path="/Playing" element={<PlayingPage />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/chatRoomList" element={<ChatRoomList onSelectChatRoom={undefined} />} />
        <Route path="/chat-rooms/:roomNumber" element={<ChatRoomItem />} />
      </Routes>
    </Router>
  );
}

export default App;
