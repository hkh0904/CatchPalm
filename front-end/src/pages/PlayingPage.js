import React, {   } from 'react';
import Grid from '@mui/material/Grid';
// import CanvasDemo from '../components/PlayingComponents/CanvasDemo';
import HandModel from '../components/PlayingComponents/HandModel';
function App() {
  // const [testLabel, setTestLabel] = useState('None') ;
  return (
    <React.Fragment>
      <Grid className="mainGrid"  container spacing={2}>
        <Grid item style={{padding : 0}}>
            {/* <CanvasDemo></CanvasDemo> */}
            <HandModel ></HandModel>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default App;
