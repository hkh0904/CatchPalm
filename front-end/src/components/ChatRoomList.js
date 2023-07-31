import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatRoomItem from './ChatRoomItem';

const ChatRoomList = ({ onSelectChatRoom }) => {
  const [chatRooms, setChatRooms] = useState([]);

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
          <p>방제목: {room.title}</p>
          <p>방장: {room.nickname}</p>
          <p>현재원/정원 {room.cntUser}/{room.capacity}</p>
          
          {/* 여기에 추가적인 방 정보들을 표시할 수 있습니다. */}
          {/* <p>Participants: {room.participants.join(', ')}</p> */}
          <hr />
        </div>
      ))}
    </div>
  );
};

export default ChatRoomList;
