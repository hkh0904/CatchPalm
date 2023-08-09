import React, {   } from 'react';
import Grid from '@mui/material/Grid';
import Ranking from '../components/RankingComponents/Ranking';
function App() {
  return (
    <React.Fragment>
      <Grid className="mainGrid"  container spacing={2}>
        <Grid>
            <Ranking ></Ranking>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default App;
