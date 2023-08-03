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

  const handleCheckUserId = async () => {
    if (state.userId.trim() === '') {
      alert('아이디를 입력해주세요.');
    } else {
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
    }
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
      <button type="button" onClick={handleCheckUserId}>
        아이디 중복검사
      </button>
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
        <select name="sex" onChange={handleChange}>
          <option value="">Select gender</option>
          <option value="1">남성</option>
          <option value="2">여성</option>
        </select>
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}

export default SignUp;







// 비밀번호 양식 명세서대로, 가입할때마다 귀찮아서 아래로 내려놓음 /// 

// 비밀번호는 9자 이상, 대소문자 특수문자 포함되어야 한다

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function SignUp() {
//   const [state, setState] = useState({
//     userId: '',
//     password: '',
//     age: '',
//     sex: '',
//   });

//   const [errorMessage, setErrorMessage] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (event) => {
//     setState({
//       ...state,
//       [event.target.name]: event.target.value,
//     });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     // Check password length
//     if (state.password.length < 9) {
//       setErrorMessage('비밀번호는 최소 9글자 이상이어야 합니다.');
//       return;
//     }

//     // Check if password contains both upper and lowercase letters and special characters
//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,}$/;
//     if (!passwordRegex.test(state.password)) {
//       setErrorMessage('비밀번호는 대소문자, 특수문자가 모두 포함되어야 합니다.');
//       return;
//     }

//     // Reset the error message if the validation passes
//     setErrorMessage('');

//     try {
//       const response = await axios.post('https://localhost:8443/api/v1/users', {
//         userId: state.userId,
//         password: state.password,
//         age: state.age,
//         sex: state.sex,
//       });
//       console.log(response.data);

//       // If the request is successful, navigate to the login page
//       navigate('/login');
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       {errorMessage && <p>{errorMessage}</p>}
//       <label>
//         UserID:
//         <input type="text" name="userId" onChange={handleChange} />
//       </label>
//       <label>
//         Password:
//         <input type="password" name="password" onChange={handleChange} />
//       </label>
//       <label>
//         Age:
//         <input type="text" name="age" onChange={handleChange} />
//       </label>
//       <label>
//         Gender:
//         <select name="sex" onChange={handleChange}>
//           <option value="">Select gender</option>
//           <option value="1">남성</option>
//           <option value="2">여성</option>
//         </select>
//       </label>
//       <input type="submit" value="Submit" />
//     </form>
//   );
// }

// export default SignUp;
