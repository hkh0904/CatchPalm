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
import APPLICATION_SERVER_URL from '../ApiConfig';

const theme = createTheme();

function SignUp() {
  const [state, setState] = useState({
    userId: '',
    password: '',
    age: '',
    sex: '',
  });

  const [userIdMessage, setUserIdMessage] = useState({text: "", color: "inherit"});

  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState({
      ...state,
      [name]: value,
    });
    
    if (name === 'userId') {
      if (!isValidEmail(value)) {
        setUserIdMessage({text: '유효한 이메일 형식이 아닙니다.', color: "error"});
        return;
      }
      handleCheckUserId(value);
    }
  };

  const handleCheckUserId = async (userId) => {
    try {
      const response = await axios.post(`${APPLICATION_SERVER_URL}/api/v1/users/duplicated/userId`, { userId });
      
      if (response.data.duplicated) {
        setUserIdMessage({text: '이미 사용중인 아이디입니다.', color: "error"});
      } else {
        setUserIdMessage({text: '사용 가능한 아이디입니다.', color: "success"});
      }
    } catch (error) {
      console.error(error);
      alert("아이디 중복검사에 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${APPLICATION_SERVER_URL}/api/v1/users`, {
        userId: state.userId,
        password: state.password,
        age: state.age,
        sex: state.sex,
      });
      console.log(response.data);

      if (response.status === 200) {
        alert("가입하신 이메일을 확인해주세요!");
      }
      
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert("이메일 인증에 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ backgroundColor: 'white' }}>
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
              <Box sx={{ height: 16 }} />
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
                <Typography variant="body2" color={userIdMessage.color}>{userIdMessage.text}</Typography>
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
              {/* <Grid item>
                <Link href="/login">
                  Already have an account? Sign in
                </Link>
              </Grid> */}
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  </div>
  );
}

export default SignUp;
