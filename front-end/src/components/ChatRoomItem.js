import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import WebSocket from './WebSocket';

const ChatRoomItem = () => {
  const { roomNumber } = useParams();
  const [roomInfo, setRoomInfo] = useState(null);

  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/gameRooms/getGameRoomInfo/${roomNumber}`);
        console.log(response.data);
        const data = response.data;
        setRoomInfo(data);
      } catch (error) {
        console.error('Error fetching room info:', error);
      }
    };
    fetchRoomInfo();
  }, [roomNumber]);

  if (!roomInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>채팅 애플리케이션</h1>
      <WebSocket
        roomNumber={roomNumber}
        username="john_doe" // 적절한 사용자 이름으로 설정해주세요.
        userNumber={456} // 적절한 사용자 번호로 설정해주세요.
      />
      <div>
        <h3>{roomInfo.title}</h3>
        <p>방장: {roomInfo.nickname}</p>
        <p>현재원/정원: {roomInfo.cntUser}/{roomInfo.capacity}</p>
        <p>개인전/팀전: {roomInfo.typeName}</p>
        <p>{roomNumber}</p>
        {/* 기타 방 정보 표시 */}
      </div>
    </div>
  );
};

export default ChatRoomItem;
