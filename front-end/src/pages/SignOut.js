import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 사용자에게 확인 메시지를 보여줍니다.
    if (!window.confirm('정말로 회원 탈퇴를 진행하시겠습니까?')) {
      navigate('/');
      return;
    }

    const deleteUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete('https://localhost:8443/api/v1/users/delete', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response.data);

        // 회원 탈퇴 후 로그아웃 처리를 합니다.
        localStorage.removeItem('token');

        // 메인 페이지로 이동합니다.
        navigate('/');

      } catch (error) {
        console.error(error);
      }
    };

    deleteUser();
  }, [navigate]);

  return (
    <div>Processing...</div>
  );
}

export default SignOut;
