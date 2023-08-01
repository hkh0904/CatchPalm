import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ChatRoomItem from './ChatRoomItem';

const ChatRoomList = ({ onSelectChatRoom }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showChatRoomItem, setShowChatRoomItem] = useState(false);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/gameRooms/listRooms');
        const data = response.data;
        setChatRooms(data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching chat rooms:', error);
      }
    };
    fetchChatRooms();
  }, []);

  const [newRoomData, setNewRoomData] = useState({
    capacity: '',
    categoryNumber: '',
    password: '',
    userNumber: '',
  });

  const handleCreateChatRoom = async () => {
    try {
      const response = await axios.post('/api/v1/gameRooms/create', newRoomData);
      const createdRoom = response.data;
      console.log('Created chat room:', createdRoom);
      

      
      setChatRooms((prevChatRooms) => [...prevChatRooms, createdRoom]);
    } catch (error) {
      console.error('Error creating chat room:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewRoomData({
      ...newRoomData,
      [name]: value,
    });
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setShowChatRoomItem(true);
  };

  return (
    <div>
      <div>
        {/* 방 만들기 폼 */}
        <label>
          채팅방 이름:
          <input type="text" name="title" value={newRoomData.title} onChange={handleInputChange} />
        </label>
        <button onClick={handleCreateChatRoom}>방 만들기</button>
      </div>
      {/* 채팅방 리스트 */}
      {chatRooms.map((room) => (
        <div key={room.id}>
          {/* 여기에 onClick 이벤트를 추가합니다. */}
          <Link to={`/chat-rooms/${room.id}`} style={{ textDecoration: 'none' }}>
            <p onClick={() => handleRoomClick(room)} style={{ cursor: 'pointer' }}>
              방제목: {room.title}
            </p>
          </Link>
          <p>방장: {room.nickname}</p>
          <p>현재원/정원 {room.cntUser}/{room.capacity}</p>
          <hr />
        </div>
      ))}

      {/* 선택된 방이 있고, showChatRoomItem이 true인 경우에만 ChatRoomItem을 렌더링합니다 */}
      {showChatRoomItem && selectedRoom && (
        <ChatRoomItem room={selectedRoom} onSelectChatRoom={onSelectChatRoom} />
      )}
    </div>
  );
};

export default ChatRoomList;
