import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
//  이미 style은 선언되어서 styles로 씀
import styles from './Userinfo.module.css';
import APPLICATION_SERVER_URL from '../ApiConfig';
import { useNavigate } from 'react-router-dom';

const Userinfo = () => {
    const [userInfo, setUserInfo] = useState(null);
    const defaultProfileImg = "/assets/basicprofile.jpg";
    const navigate = useNavigate();
    

    // 로그아웃
    const handleLogout = () => {
        localStorage.removeItem('token'); // 토큰 삭제
        navigate('/');
      };


    useEffect(() => {
        const token = localStorage.getItem('token');
        
        // 예외처리: 로그인 안된 경우
        if (!token) {
            alert('로그인 후 이용해 주세요.');
            navigate('/');
            return;
        }    
        const fetchData = async () => {
            
            const response = await axios.get(`${APPLICATION_SERVER_URL}/api/v1/users/me`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // 예외처리: 로그인 되어있지 않다면 유저정보 볼 수 없음


            if (response.status === 200) {
                setUserInfo(response.data);
            }
        };

        fetchData();
    }, []);
    // 이미지 업로드
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const base64String = await blobToBase64(file);

        const token = localStorage.getItem('token');
        await axios.patch(`${APPLICATION_SERVER_URL}/api/v1/users/modify`, {
            profileImg: base64String
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        const response = await axios.get(`${APPLICATION_SERVER_URL}/api/v1/users/me`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.status === 200) {
            setUserInfo(response.data);
        }
    };

    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const handlePasswordChange = async () => {
        const newPassword = prompt('Enter new password:');
        
        if (newPassword) {
            const token = localStorage.getItem('token');
            
            const response = await axios.patch(`${APPLICATION_SERVER_URL}/api/v1/users/modify`, {
                age: "",
                password: newPassword,
                backSound: "",
                effectSound: "",
                gameSound: "",
                isCam: "",
                profileImg: "",
                profileMusic: "",
                sex: "",
                synk: "",
                nickname: ""
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.status === 200) {
                setUserInfo(prevState => ({ ...prevState, userPassword: newPassword }));
                alert('비밀번호가 변경되었습니다!');
            }
        }
    }

    const handleNicknameChange = async () => {
        const newNickname = prompt('Enter new nickname:');
        
        if (newNickname) {
            const token = localStorage.getItem('token');

            const duplicationResponse = await axios.get(`${APPLICATION_SERVER_URL}/api/v1/users/duplicated`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    nickname: newNickname
                }
            });
    
            if (duplicationResponse.data.duplicated) {
                alert('이미 사용중인 닉네임입니다');
                return;
            }

            const response = await axios.patch(`${APPLICATION_SERVER_URL}/api/v1/users/modify`, {
                age: "",
                backSound: "",
                effectSound: "",
                gameSound: "",
                password: "",
                isCam: "",
                profileImg: "",
                profileMusic: "",
                sex: "",
                synk: "",
                nickname: newNickname,
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
        }
    }

    const handleProfileImageClick = () => {
        hiddenFileInput.current.click();
    };

    const hiddenFileInput = useRef(null);

    const handleDeleteAccount = () => {
        // Confirmation before account deletion
        if (!window.confirm('정말로 회원 탈퇴를 진행하시겠습니까?')) {
          return; // If user cancels (clicks 'No'), stop the function
        }
        
        const token = localStorage.getItem('token');
    
        fetch(`${APPLICATION_SERVER_URL}/api/v1/users/delete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // or however your server expects the token
          }
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            console.log(token)
              console.log(response)
            throw new Error('Error during account deletion');
          }
        })
        .then(data => {
          // Handle successful deletion here, such as by logging out the user
          localStorage.removeItem('token');
          window.location.reload();
        })
        .catch(error => {
          // Handle any errors here
          console.error('Error:', error);
        });
      };

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0 90px'
        }}>
            <h1 className={styles.h1}>유저 정보</h1>
            <img className={styles.img} height={"150px"} src={userInfo.profileImg || defaultProfileImg} alt="Profile" />
            <br/>
            <button className={styles.button} onClick={handleProfileImageClick}>
                프로필 사진 변경하기
            </button>
            <input
                type="file"
                ref={hiddenFileInput}
                onChange={handleImageUpload}
                style={{ display: 'none' }}
            />
            <p>User Number: {userInfo.userNumber}</p>
            <p>User ID: {userInfo.userId}</p>
            <p>
                User Nickname: {userInfo.userNickname} 
                <br/>
                <button className={styles.button} onClick={handleNicknameChange}>닉네임 변경하기</button>
            </p>
            <p>Age: {userInfo.age}</p>
            <p>Sex: {userInfo.sex === 0 ? 'Male' : 'Female'}</p>
            <button className={styles.button} onClick={handlePasswordChange}>비밀번호 변경하기</button>
            
            <div className={styles.logout}>
                <button onClick={handleLogout}>
                  로그아웃
                </button>
            </div>
            
            <div className={styles.signout}>
                <button onClick={handleDeleteAccount}>
                  회원탈퇴
                </button>
            </div>
        </div>
    );
}

export default Userinfo;
