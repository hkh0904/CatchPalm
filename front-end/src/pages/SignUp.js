import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

function SignUp() {
  const [state, setState] = useState({
    userId: '',
    password: '',
    age: '',
    sex: '',
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleCheckUserId = async () => {
    try {
      const response = await axios.post(`https://localhost:8443/api/v1/users/duplicated/userId`, { userId: state.userId });
      if (response.data.duplicated) {
        alert('이미 사용중인 아이디입니다.');
      } else {
        alert('사용 가능한 아이디입니다.');
      }
    } catch (error) {
      alert('아이디 확인에 실패하였습니다.');
      console.error(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://localhost:8443/api/v1/users', {
        userId: state.userId,
        password: state.password,
        age: state.age,
        sex: state.sex,
      });
      console.log(response.data);

      // If the request is successful, navigate to the login page
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
  
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="age"
                  label="Age"
                  type="number"
                  onChange={handleChange}
                />
              </Grid>
              <Box sx={{ height: 16 }} />  {/* Add a line break */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="sex"
                  label="Gender"
                  select
                  SelectProps={{
                    native: true,
                  }}
                  onChange={handleChange}
                >
                  <option value=""></option>
                  <option value="0">남성</option>
                  <option value="1">여성</option>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="userId"
                  required
                  fullWidth
                  label="UserID"
                  onChange={handleChange}
                />
                <Button fullWidth onClick={handleCheckUserId} sx={{ mt: 1, mb: 2 }}>
                  Check UserID
                </Button>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SignUp;
