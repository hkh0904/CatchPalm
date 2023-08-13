import React, {   } from 'react';
import Grid from '@mui/material/Grid';
import Result from '../components/ResultComponents/Result';
import style from './ResultPage.module.css'
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const gameRoomRes = location.state ? location.state.gameRoomRes : {};

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
          <a href='/chatRoomList' className={style.bottom_right}>
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
