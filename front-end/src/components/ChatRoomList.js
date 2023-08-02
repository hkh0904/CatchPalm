import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChatRoomList = ({ }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/gameRooms/listRooms');
        const data = response.data;
        setChatRooms(data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching chat rooms:', error);
      }
    };
    fetchChatRooms();
  }, []);


  const handleEnterChatRoom = (roomNumber) => {
    // 여기서 버튼을 누르면 다른 경로로 이동하도록 합니다.
    navigate(`/chat-rooms/${roomNumber}`);
  };


  return (
    <div>
      {/* 채팅방 리스트 */}
      {chatRooms.map((room) => (
        <div key={room.id}>
          {/* 여기에 onClick 이벤트를 추가합니다. */}
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
