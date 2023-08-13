import React, {   } from 'react';
import './PlayingPage.css';
import Grid from '@mui/material/Grid';
import HandModel from '../components/PlayingComponents/HandModel';
import OpenVidu from '../components/PlayingComponents/OpenVidu';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const { gameData } = location.state; // 전달된 데이터 가져오기

  console.log(gameData); // 데이터확인.

  return (
    <React.Fragment>
      <Grid className="mainGrid" container spacing={2} 
      style={{ backgroundColor: 'black', marginTop: 0, marginLeft: 0, position: 'relative' }}>
        <Grid item xs={10} style={{ padding: 0 }}>
          <HandModel gameData={gameData} />
        </Grid>
        <Grid item xs={2} 
        style={{ padding: 0, position: 'absolute', top: 0, right: 0, height: '100vh', zIndex: 1}}>
          <OpenVidu gameData={gameData} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}


export default App;
