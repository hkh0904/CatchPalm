// import './App.css'; // 필요한 경우 주석을 제거하고 사용하세요.
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import PlayingPage from './pages/PlayingPage';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import SignOut from './pages/SignOut';

import './index.css'; // CSS 파일 import


// ...

function MainPage() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');  // 로그인 토큰 확인

  const handleButtonClick = () => {
    navigate('/Playing');
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // 토큰 삭제
    window.location.reload(); // 페이지 갱신
  };

const handleDeleteAccount = () => {
  const token = localStorage.getItem('token');
  
  fetch('http://localhost:8080/api/v1/users/delete', {
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


  return (
    <React.Fragment>
      <Grid className="mainGrid" container spacing={2}>
        <Grid item xs={4} md={8} lg={8}>
          {isLoggedIn ? (  // 로그인 상태일 때만 버튼을 보여줍니다.
            <React.Fragment>
              <h1>로그인 된 메인페이지</h1>
              <Button variant="contained" onClick={handleButtonClick}>
                Go to Sample Page
              </Button>
              <Button variant="contained" onClick={handleLogout}>
                Logout
              </Button>
              <Button variant="contained" onClick={handleDeleteAccount}>
                회원 탈퇴
              </Button>
            </React.Fragment>
          ) : ( // 로그인이 안되어 있을 때는 메시지를 보여줍니다.
            <h1>로그인 안되있는 메인페이지</h1>
            
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

function App() {
  const isLoggedIn = !!localStorage.getItem('token');  // 로그인 토큰 확인

  return (
    <Router>
      <div className="navbar"> 
        <Link className="navbar-item" to="/">메인 페이지</Link> 
        {!isLoggedIn && (
          <>
            <Link className="navbar-item" to="/login">로그인</Link>
            <Link className="navbar-item" to="/signup">회원가입</Link>
          </>
        )}
      </div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/Playing" element={<PlayingPage />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/signout" component={SignOut} />
      </Routes>
    </Router>
  );
}

export default App;
