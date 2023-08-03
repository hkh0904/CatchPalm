import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

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
      const response = await axios.post('https://localhost:8443/api/v1/auth/login', {
        userId,
        password
      });
      if (response.status === 200) {


        const token = response.data.accessToken;

        localStorage.setItem('token', token);
        
        navigate('/');  // Redirect to App.js (assuming it's routed at '/')
        window.location.reload(); // 페이지 갱신
      } else {
        setErrorMessage('아이디 패스워드를 다시 확인해주세요');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('아이디 패스워드를 다시 확인해주세요');
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={handleBackButtonClick}>
        메인페이지로 이동
      </Button>
      <form onSubmit={handleSubmit}>
        <label>
          UserID:
          <input type="text" value={userId} onChange={handleChangeUserId} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={handleChangePassword} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default Login;
