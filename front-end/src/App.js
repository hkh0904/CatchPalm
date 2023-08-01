// import './App.css'; // 필요한 경우 주석을 제거하고 사용하세요.
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import PlayingPage from './pages/PlayingPage';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function MainPage() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/Playing');
  };

  return (
    <React.Fragment>
      <Grid className="mainGrid" container spacing={2}>
        <Grid item xs={4} md={8} lg={8}>
          <Button variant="contained" onClick={handleButtonClick}>
            Go to Sample Page
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
      </Routes>
    </Router>
  );
}

export default App;
