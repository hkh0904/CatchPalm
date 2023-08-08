import React, {   } from 'react';
import Grid from '@mui/material/Grid';
import Ranking from '../components/RankingComponents/Ranking';
import './RankingPage.css'
function App() {
  return (
    <React.Fragment>
      <video autoPlay muted loop className="background-video">
        <source src="assets/background_ranking2.mp4" type="video/mp4" />
      </video>
      <div className="overlay-div"> {/* 큰 사각형 div 추가 */}
      <Grid className="mainGrid"  container spacing={1}>
        <Grid>
            <Ranking ></Ranking>
        </Grid>
      </Grid>
        <div>
          <a href='#' className="bottom-right">
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
