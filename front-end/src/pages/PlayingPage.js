import React, {   } from 'react';
import './PlayingPage.css'
import Grid from '@mui/material/Grid';
import HandModel from '../components/PlayingComponents/HandModel';
function App() {
  return (
    <React.Fragment>
      <Grid className="mainGrid"  container spacing={2}>
        <Grid item style={{padding : 0}}>
            <HandModel ></HandModel>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default App;
