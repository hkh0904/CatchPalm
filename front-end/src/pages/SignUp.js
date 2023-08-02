import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://localhost:8443/api/v1/users', {
        userId: state.userId,
        password: state.password,
        age: state.age,
        sex: state.sex
      });
      console.log(response.data);

      // If the request is successful, navigate to the login page
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        UserID:
        <input type="text" name="userId" onChange={handleChange} />
      </label>
      <label>
        Password:
        <input type="password" name="password" onChange={handleChange} />
      </label>
      <label>
        Age:
        <input type="text" name="age" onChange={handleChange} />
      </label>
      <label>
        Gender:
        <input type="text" name="sex" onChange={handleChange} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}

export default SignUp;
