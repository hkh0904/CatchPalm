// import './App.css'; // 필요한 경우 주석을 제거하고 사용하세요.
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import PlayingPage from './pages/PlayingPage';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Login from './pages/Login';
import SignUp from './pages/SignUp';


function MainPage() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');  // 로그인 토큰 확인
  // const isLoggedIn = 1

  const handleButtonClick = () => {
    navigate('/Playing');
  };

  return (
    <React.Fragment>
      <Grid className="mainGrid" container spacing={2}>
        <Grid item xs={4} md={8} lg={8}>
          {isLoggedIn ? (  // 로그인 상태일 때만 버튼을 보여줍니다.
            <Button variant="contained" onClick={handleButtonClick}>
              Go to Sample Page
            </Button>
          ) : ( // 로그인이 안되어 있을 때는 메시지를 보여줍니다.
            <p>로그인 안되있는 메인페이지</p>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}


function App() {
  return (
    <Router>
      <div>
        <Link to="/">메인 페이지</Link>
        <br/>
        <Link to="/login">로그인</Link>
        <br />
        <Link to="/signup">회원가입</Link>
      </div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/Playing" element={<PlayingPage />} />
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;
