import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

let CreatedroomNumber = ''; // 전역 변수로 선언

const Modal = ({ isOpen, onClose, onCreateRoom }) => {
  const [userNumber, setUserNumber] = useState(''); // userNumber 상태로 추가
  useEffect(() => {
    // localStorage에서 데이터 가져오기
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUserNumber(parsedData.userNumber);
    }
  }, []);

  
  const [roomData, setRoomData] = useState({
    capacity: '',
    categoryNumber: '',
    password: '',
    title: '',
    userNumber: '',
    roomNumber: ''
  });

  const updateRoomData = (newData) => {
    setRoomData((prevData) => ({
      ...prevData,
      ...newData,
      userNumber: userNumber // localStorage에서 가져온 userNumber로 설정
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateRoomData({ [name]: value });
    setRoomData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateRoom = () => {
    onCreateRoom(roomData);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    
    <div className="modal">
      <div className="modal-content">
        <h2>방만들기 창</h2>
        <div>
          <label>제목</label>
          <input type="text" name="title" value={roomData.title} onChange={handleChange} />
        </div>
        <div>
          <label>categoryNumber</label>
          <input type="number" name="categoryNumber" value={roomData.categoryNumber} onChange={handleChange} />
        </div>
        <div>
          <label>비밀번호</label>
          <input type="text" name="password" value={roomData.password} onChange={handleChange} />
        </div>
        <div>
          <label>capacity</label>
          <input type="number" name="capacity" value={roomData.capacity} onChange={handleChange} />
        </div>
        <button onClick={() => { handleCreateRoom();}}>확인</button>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

const ChatRoomList = ({}) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    
    const fetchChatRooms = async () => {
      try {
        const response = await axios.get('https://localhost:8443/api/v1/gameRooms/listRooms');
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

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCreateRoom = async (roomData) => {
    try {
      const response = await axios.post('https://localhost:8443/api/v1/gameRooms/create', roomData);
      CreatedroomNumber = response.data.roomNumber;
      handleEnterChatRoom(CreatedroomNumber);
    } catch (error) {
      console.error('Error craating a new room:', error);
    }
  };

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} onCreateRoom={handleCreateRoom} />
      <div>
        <button onClick={handleOpenModal}>방만들기</button>
        <hr></hr>
      </div>
      {chatRooms.map((room) => (
        <div key={room.id}>
          <button onClick={() => handleEnterChatRoom(room.roomNumber)} style={{ cursor: 'pointer' }}>
            입장하기
          </button>
          <p>방제목: {room.title}</p>
          <p>방장: {room.nickname}</p>
          <p>현재원/정원 {room.cntUser}/{room.capacity}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default ChatRoomList;