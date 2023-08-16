import React, {   } from 'react';
import Grid from '@mui/material/Grid';
import Result from '../components/ResultComponents/Result';
import style from './ResultPage.module.css'
import APPLICATION_SERVER_URL from "../ApiConfig";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const gameRoomRes = location.state ? location.state.gameRoomRes : {};
  const navigate = useNavigate();

  // 게임 대기방으로 이동
    const fetchRoomInfo = async () => {
      try {
        const response = await axios.get(
          `${APPLICATION_SERVER_URL}/api/v1/gameRooms/inGameToWaiting/${gameRoomRes.roomNumber}`
        );
        const data = response.data;
        console.log("대기방입장",data);
        if (data === 1) {
          navigate(`/chat-rooms/${gameRoomRes.roomNumber}`); 
        }
        else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching room info:", error);
        navigate("/");
      }
    };
  return (
    <React.Fragment>
      <div className={style.rankingPageContainer}>
      <video autoPlay muted loop className={style.background_video}>
        <source src="/assets/background_result.mp4" type="video/mp4" />
      </video>
      <div className={style.overlay_div}> {/* 큰 사각형 div 추가 */}
      <Grid className={style.mainGrid}  container spacing={1}>
        <Grid>
            <Result gameRoomRes={gameRoomRes}></Result>
        </Grid>
      </Grid>
      </div>
        <div>
          <a className={style.bottom_right} onClick={fetchRoomInfo}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Home</a>
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
