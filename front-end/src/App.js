// import './App.css'; // 필요한 경우 주석을 제거하고 사용하세요.
import React from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import PlayingPage from './pages/PlayingPage';
import ChatRoomItem from "./components/ChatRoomItem";
import ChatRoomList from "./components/ChatRoomList"; // chat 리스트방으로
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function MainPage() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/Playing');
  };

  const handleButtonClick2 = () => {
    navigate('/ChatRoomList');
  };

  return (
    <React.Fragment>
      <Grid className="mainGrid" container spacing={2}>
        <Grid item xs={4} md={8} lg={8}>
          <Button variant="contained" onClick={handleButtonClick}>
            Go to Sample Page
          </Button>
          <br />
          <br />
          <Button variant="contained" onClick={handleButtonClick2}>
            채팅방리스트로 가기
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Playing" element={<PlayingPage />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/chatRoomList" element={<ChatRoomList onSelectChatRoom={undefined} />} />
        <Route path="/chat-rooms/:roomNumber" element={<ChatRoomItem />} />
      </Routes>
    </Router>
  );
}

export default App;
