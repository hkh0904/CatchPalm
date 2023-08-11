import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import style from './ChatRoomList.module.css'
// import { Padding } from '@mui/icons-material';
// import LockIcon from '@mui/icons-material/Lock';
// import LockOpenIcon from '@mui/icons-material/LockOpen';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import RefreshIcon from '@mui/icons-material/Refresh';

//const APPLICATION_SERVER_URL = process.env.NODE_ENV === 'https://i9c206.p.ssafy.io/api' ? '' : 'https://localhost:8443';
let APPLICATION_SERVER_URL = '';
if(process.env.NODE_ENV === 'production') {
  APPLICATION_SERVER_URL = 'https://i9c206.p.ssafy.io/api';
} else {
  APPLICATION_SERVER_URL = 'https://localhost:8443';
}

let CreatedroomNumber = ''; // 전역 변수로 선언

const Modal = ({ isOpen, onClose, onCreateRoom }) => {
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const [showCapacityOptions, setShowCapacityOptions] = useState(false); // 방 정원 부분

  const handleTogglePasswordInput = () => {
    setShowPasswordInput(!showPasswordInput);
  };

  const handleCapacityOptionClick = (option) => {
    setRoomData((prevData) => ({
      ...prevData,
      capacity: option,
    }));
    setShowCapacityOptions(false);
  };
  const [userNumber, setUserNumber] = useState(''); // userNumber 상태로 추가
  const token = localStorage.getItem('token');
  useEffect(() => {
    // localStorage에서 데이터 가져오기
    const token = localStorage.getItem('token');
    axios({
      method: 'get',
      url: `${APPLICATION_SERVER_URL}/api/v1/users/me`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // your access token here
      }
    })
      .then(response => {
        const userNumber = response.data.userNumber;
        setUserNumber(userNumber);
        console.log(userNumber);
      })
      .catch(error => {
        const errorToken = localStorage.getItem('token');
        if (!errorToken) { // token이 null 또는 undefined 또는 빈 문자열일 때
          window.location.href = '/'; // 이것은 주소창에 도메인 루트로 이동합니다. 원하는 페이지 URL로 변경하세요.
          return; // 함수 실행을 중단하고 반환합니다.
        }
        console.error("error");
        const token = error.response.headers.authorization.slice(7);
        localStorage.setItem('token', token);
        axios({
          method: 'get',
          url: `${APPLICATION_SERVER_URL}/api/v1/users/me`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // your access token here
          }
        })
          .then(response => {
            const userNumber = response.data.userNumber;
            setUserNumber(userNumber);
          })
          .catch(error => {
            console.log(error);
          })
      });
  }, [token]);

  
  const [roomData, setRoomData] = useState({
    capacity: '',
    categoryNumber: '',
    password: '',
    title: '',
    userNumber: userNumber,
    roomNumber: ''
  });

  useEffect(() => {
    if (isOpen) {
      setRoomData({
        capacity: '',
        categoryNumber: '',
        password: '',
        title: '',
        userNumber: userNumber,
        roomNumber: ''
      });
    }
  }, [isOpen, userNumber]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData((prevData) => ({
      ...prevData,
      [name]: value,
      userNumber: userNumber // 기존 데이터에서 userNumber를 그대로 사용
    }));
  };

  const handleCreateRoom = () => {
    if (!roomData.title) {
      alert("방 제목을 입력 해주세요");
      return;
    }

    else if (!roomData.categoryNumber) {
      alert("게임 유형을 선택 해주세요");
      return;
    }

    else if (!roomData.capacity) {
      alert("방 정원을 입력해주세요");
      return;
    }
    onCreateRoom(roomData);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  const handleChangeCategory = (categoryNumber) => {
    setRoomData((prevData) => ({
      ...prevData,
      categoryNumber: categoryNumber,
    }));
  };
  

  return (
    <div className={style.modal}>
      <div className={style.modal_content}>
        <h2>방만들기 창</h2>
        <div>
          <label>제목</label>
          <input type="text" name="title" value={roomData.title} onChange={handleChange} />
        </div>
        <div>
          <label>게임 유형</label>
            <button onClick={() => handleChangeCategory(2)} className={roomData.categoryNumber === 2 ? 'active' : ''}
            style={{
              backgroundColor: roomData.categoryNumber === 2 ? 'blue' : 'transparent',
              color: roomData.categoryNumber === 2 ? 'white' : 'blue',
              border: '1px solid blue' 
            }}>
              개인전
            </button>
            <button onClick={() => handleChangeCategory(1)} className={roomData.categoryNumber === 1 ? 'active' : ''}
            style={{
              backgroundColor: roomData.categoryNumber === 1 ? 'green' : 'transparent',
              color: roomData.categoryNumber === 1 ? 'white' : 'green',
              border: '1px solid green' 
            }}>
              팀전
            </button>
        </div>
        <div>
          <label style={{marginTop:'5%'}}>
            비밀번호
            <input
              type="checkbox"
              checked={showPasswordInput}
              onChange={handleTogglePasswordInput}
            />
          </label>
          {showPasswordInput && (
            <input
              type="text"
              name="password"
              value={roomData.password}
              onChange={handleChange}
            />
          )}
        </div>
        <div>
          <label>capacity</label>
          {roomData.categoryNumber === 2 ? (
            <div>
              <input
                type="text"
                name="capacity"
                value={roomData.capacity}
                onChange={handleChange}
                onFocus={() => setShowCapacityOptions(true)}
                readOnly // 입력요소 쓰는거 방지
              />
              {showCapacityOptions && (
                <ul className="capacity-options">
                  <li onClick={() => handleCapacityOptionClick(1)}>1</li>
                  <li onClick={() => handleCapacityOptionClick(2)}>2</li>
                  <li onClick={() => handleCapacityOptionClick(3)}>3</li>
                  <li onClick={() => handleCapacityOptionClick(4)}>4</li>
                </ul>
              )}
            </div>
          ) : (
            <input type="number" name="capacity" value={4} disabled />
          )}
          </div>
        <button style={{color:'black'}} onClick={() => { handleCreateRoom();}}>확인</button>
        <button style={{color:'black'}} onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

const ChatRoomList = ({}) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  // 비밀번호 관련
  const [inputPassword, setInputPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  useEffect(() => {
    
    const fetchChatRooms = async () => {
      try {
        const response = await axios.get(`${APPLICATION_SERVER_URL}/api/v1/gameRooms/listRooms`);
        console.log(response);
        const data = response.data;
        setChatRooms(data);
      } catch (error) {
        console.error('Error fetching chat rooms:', error);
      }
    };
    fetchChatRooms();
  }, []);

  const handleEnterChatRoom = (roomNumber) => {
    navigate(`/chat-rooms/${roomNumber}`);
  };

  const checkEnterChatRoom = async (roomNumber, password) => {
    var reqPassword = "";
    if (password) {
      reqPassword = inputPassword;
    }
    const enterData = { "roomNumber": roomNumber, "password": reqPassword };

    try {
      const response = await axios.post(`${APPLICATION_SERVER_URL}/api/v1/gameRooms/authentication`, enterData);
  
      const resultMessage = response.data.message;
  
      if (response.data.message == "입장성공") {
        handleEnterChatRoom(roomNumber);
      }
      else {
        alert(resultMessage);
        setInputPassword(''); // 비밀번호 입력 필드 값 초기화
      }
    } catch (error) {
      console.error('Error authentication', error);
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCreateRoom = async (roomData) => {
    try {
      const response = await axios.post(`${APPLICATION_SERVER_URL}/api/v1/gameRooms/create`, roomData);
      CreatedroomNumber = response.data.roomNumber;
      handleEnterChatRoom(CreatedroomNumber);
      
    } catch (error) {
      console.error('Error craating a new room:', error);
    }
  };
  
  const closeModal = () => {
    setShowPasswordInput(!showPasswordInput);
    setInputPassword(''); // 비밀번호 입력 필드 값 초기화
  };

  // 비밀번호 입력창 보이기/숨기기 함수
  const togglePasswordInput = (e) => {

    if (e.target.tagName === 'INPUT') {
      return;
    }
    // 모달 컨텐츠 내부 요소를 클릭한 경우에는 모달이 사라지지 않도록 처리
    if (e.target.closest('.modal-content')) {
      return;
    }
    setShowPasswordInput(!showPasswordInput);
  };
  
  // 비밀번호가 입력되면 실행되는 함수
  const handlePasswordInput = (event) => {
    setInputPassword(event.target.value);
  };
  
  const handleRefresh = () => {
    const fetchChatRooms = async () => {
      try {
        const response = await axios.get(`${APPLICATION_SERVER_URL}/api/v1/gameRooms/listRooms`);
        console.log(response);
        const data = response.data;
        setChatRooms(data);
      } catch (error) {
        console.error('Error fetching chat rooms:', error);
      }
    };
    fetchChatRooms();
  };
  
  return (
    <div>
      <video autoPlay muted loop className={style.background_videoChatList}>
        <source src="assets/background_ChatList.mp4" type="video/mp4"/>
      </video>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} onCreateRoom={handleCreateRoom} />
      <div
      style={{
      // justifyContent: 'flex-end',
      marginRight: '15%',
      marginTop: '8%',}}>
        
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom:'1%'}}>
        <div style={{display: 'flex', alignItems:'center', marginLeft: '15%'}}>
        <a style={{width:'85%', height:'25%'}} onClick={handleRefresh}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <RefreshIcon/></a>
        </div>
        <div style={{display: 'flex'}}>
        <div>
        <a style={{width:'100%', height:'25%', }}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <input style={{width:'100%', height:'100%', backgroundColor: 'rgba(0, 0, 0, 0.2)', color: 'white', border: 'none'}} 
            // value={}
            type=""
            name="search"
            placeholder="방 제목을 검색해주세요">
            </input></a>
        </div>
        
        {/* <button style={{backgroundColor: 'rgba(0, 0, 0, 0.2)', color: 'white'}} onClick={handleOpenModal}>방만들기</button> */}
        <div style={{marginLeft: '20%'}}> 
        <a style={{width:'85%', height:'25%'}} onClick={handleOpenModal}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            방 만들기</a>
        </div>
        </div>
        
      </div>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        // marginTop: '15%',
      }}>
      <div className={style.inside_div}>
        {chatRooms.map((room) => (
          <button
            className={style.button_chatRoomList}
            onClick={room.password && room.status !== 1
              ? togglePasswordInput
              : () => {
                  if (room.status === 1) {
                    alert("이미 게임중인 방입니다.");
                  } else {
                    checkEnterChatRoom(room.roomNumber, room.password, room.status);
                  }
                }}
            key={room.id}
            style={{
              backgroundColor: room.status === 1 ? 'rgba(0, 0, 0, 0.2)' : '#f367ce',
            }}
          >
            {/* Display the "Waiting" or "Playing" text on the right */}
            <div>
              {room.status === 0 ? <p style={{color: 'white'}}>Waiting</p> : <p style={{color: 'white'}}>Playing</p>}
            </div>
            <div>
              <div className={style.ChatRoomList_minibackground}>
              <p style={{ marginLeft: '5px', color: 'white',}}>{room.roomNumber}.{room.title}[{room.typeName}]</p>
              <p style={{color: 'white'}}>{room.password && <VpnKeyIcon />}</p>
              </div>
              <p style={{color: 'white'}}>방장:{room.nickname}</p>
              <p style={{color: 'white'}}>현재원/정원 {room.cntUser}/{room.capacity}</p>
            </div>
            {/* Display the thumbnail image on the left */}
            <img src={room.thumbnail} style={{ maxWidth: '90px', maxHeight: '90px', borderRadius: '10px', }} />
            {room.password && (
              <>
                {showPasswordInput && (
                  <div className={style.modal_content_password}>
                    <label>비밀번호:</label>
                    <input
                      type="password"
                      value={inputPassword}
                      onChange={handlePasswordInput}
                    />
                    <button
                      onClick={() => checkEnterChatRoom(room.roomNumber, room.password)}
                      style={{ cursor: 'pointer' }}
                    >
                      입장하기!
                    </button>
                    <button onClick={closeModal} style={{ cursor: 'pointer' }}>
                      닫기
                    </button>
                  </div>
                )}
              </>
            )}
          </button>
        ))}
      </div>
      </div>   
      <div>
        <div style={{display:'flex', justifyContent: 'center', marginTop: '1%'}}>
          <div>
          </div>
        <a href='/'>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Home</a>
        </div>
      </div>   
    </div>
    
  );
};

export default ChatRoomList;