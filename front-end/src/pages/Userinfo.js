import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Userinfo = () => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                
                const response = await axios.get('https://localhost:8443/api/v1/users/me', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.status === 200) {
                    setUserInfo(response.data);
                }
                
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);

    const handleNicknameChange = async () => {
        const newNickname = prompt('Enter new nickname:');
        
        if (newNickname) {
            try {
                const token = localStorage.getItem('token');
                
                
                const response = await axios.patch('https://localhost:8443/api/v1/users/modify', {
                    age : "",
                    password : "",
                    profileImg : "",
                    profileMusic : "",
                    sex : "",
                    synk : "",
                    nickname: newNickname
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    
                    }
                });
                
                if (response.status === 200) {
                    setUserInfo(prevState => ({ ...prevState, userNickname: newNickname }));
                    alert('닉네임이 변경되었습니다!');
                }
                
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>유저 정보</h1>
            <p>User Number: {userInfo.userNumber}</p>
            <p>User ID: {userInfo.userId}</p>
            <p>
                User Nickname: {userInfo.userNickname} 
                <button onClick={handleNicknameChange}>닉네임 변경하기</button>
            </p>
            <p>Age: {userInfo.age}</p>
            <p>Sex: {userInfo.sex === 0 ? 'Male' : 'Female'}</p>
        </div>
    );
}

export default Userinfo;
