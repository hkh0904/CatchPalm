import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import APPLICATION_SERVER_URL from '../ApiConfig';


const theme = createTheme();

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate('/');
  };

  const handleChangeUserId = (event) => {
    setUserId(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${APPLICATION_SERVER_URL}/api/v1/auth/login`, {
        userId,
        password,
      });
      if (response.status === 200) {
        const token = response.data.accessToken;
        localStorage.setItem('token', token);
        navigate('/');
        window.location.reload();
      } else {
        setErrorMessage('아이디 패스워드를 다시 확인해주세요');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('아이디 패스워드를 다시 확인해주세요');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await axios.get(`${APPLICATION_SERVER_URL}/api/v1/oauth2/authorization/google`);
      
      // Google OAuth 인증 URL로 리디렉션
      if (response.data.startsWith('redirect:')) {
        const redirectUrl = response.data.replace('redirect:', '').trim();
        window.location.href = redirectUrl;

      } else {
        setErrorMessage('Google 로그인 실패');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Google 로그인 실패');
    }
  };
  
  // 콜백 URL에서 호출될 함수 (예: componentDidMount 또는 useEffect 내부에서 호출)
  const handleOAuthCallback = async () => {
    const response = await axios.get(`${APPLICATION_SERVER_URL}/api/v1/oauth2/callback`); // 여기서 액세스 토큰을 가져오는 백엔드 엔드포인트를 지정해야 합니다.
    console.log(response.data)
    if (response.data.message === 'Success') {
      localStorage.setItem('token', response.data.accessToken);
      window.location.href = "http://localhost:3000/";
    } else {
      setErrorMessage('Google 로그인 실패');
    }
  };
  
  
  

  return (
    <ThemeProvider theme={theme}>
        
          <Box
            sx={{
              maxWidth: '400px',
              my: 4,
              mx: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField 
                margin="normal"
                required
                fullWidth
                label="UserID"
                value={userId}
                onChange={handleChangeUserId}
              />
              <TextField 
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={handleChangePassword}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 2, mb: 2 }}
                onClick={handleGoogleLogin}
              >
                Sign In with Google
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/" variant="body2" onClick={handleBackButtonClick}>
                    비밀번호 찾기(미구현)
                  </Link>

                </Grid>
              </Grid>
              {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            </Box>
          </Box>
        

    </ThemeProvider>
  );
};

export default Login;
