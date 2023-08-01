import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ChatRoomItem = () => {
  const { roomNumber } = useParams(); // useParams 훅을 사용하여 라우트 매개변수를 가져옵니다.
  const [roomInfo, setRoomInfo] = useState(null);

  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/gameRooms/getGameRoomInfo/${roomNumber}`);
        console.log(response.data); // 서버 응답 출력 (테스트용)
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
      <h3>{roomInfo.title}</h3>
      <p>방장: {roomInfo.nickname}</p>
      <p>현재원/정원: {roomInfo.cntUser}/{roomInfo.capacity}</p>
      <p>개인전/팀전: {roomInfo.typeName}</p>
      {/* 기타 방 정보 표시 */}
    </div>
  );
};

export default ChatRoomItem;
