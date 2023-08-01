import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChangeUserId = (event) => {
    setUserId(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
        userId,
        password
      });
      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        navigate('/');  // Redirect to App.js (assuming it's routed at '/')
      } else {
        setErrorMessage('Please check your ID or password');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Please check your ID or password');
    }
  };

  return (
    <div>
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
