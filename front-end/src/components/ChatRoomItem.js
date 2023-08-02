import React, { useState, useEffect } from 'react';
import './ChatRoomItem.css'
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ChatRoomItem = () => {
  const { roomNumber } = useParams();
  const [roomInfo, setRoomInfo] = useState(null);

  const [name, setName] = useState('');
  const [userNumber, setUserNumber] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
    alert(name);
  };

  const handleUserNumberChange = (event) => {
    setUserNumber(event.target.value);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    // Implement the logic to send a message using WebSocket
    // You may need to add the WebSocket logic here to send messages.
  };
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
      {/* <WebSocket
        roomNumber={roomNumber}
        username="john_doe" // 적절한 사용자 이름으로 설정해주세요.
        userNumber={456} // 적절한 사용자 번호로 설정해주세요.
      /> */}
      <div>
        <h3>{roomInfo.title}</h3>
        <p>방장: {roomInfo.nickname}</p>
        <p>현재원/정원: {roomInfo.cntUser}/{roomInfo.capacity}</p>
        <p>개인전/팀전: {roomInfo.typeName}</p>
        <p>{roomNumber}</p>
        {/* 기타 방 정보 표시 */}
      </div>

      <div id="username-page">
        <div className="username-page-container">
          <h1 className="title">니이름 입력행</h1>
          <form id="usernameForm" name="usernameForm">
            <div className="form-group">
              <input
                type="text"
                id="name"
                placeholder="Username"
                autoComplete="off"
                className="form-control"
                value={name}
                onChange={handleNameChange}
              />
              <input
                type="text"
                id="userNumber"
                placeholder="UserNumber"
                autoComplete="off"
                className="form-control"
                value={userNumber}
                onChange={handleUserNumberChange}
              />
              
            </div>
            <div className="form-group">
              <button type="submit" className="accent username-submit">
                Start Chatting
              </button>
            </div>
          </form>
        </div>
      </div>

      <div id="chat-page" className="hidden">
        <div className="chat-container">
          <div className="chat-header">
            <h2 id="roomN">Spring WebSocket Chat Demo - By 민우짱</h2>
          </div>
          <div className="connecting">Connecting...</div>
          <ul id="messageArea">
            {/* Render messages from the state here */}
          </ul>
          <form id="messageForm" name="messageForm" onSubmit={handleSendMessage}>
            <div className="form-group">
              <div className="input-group clearfix">
                <input
                  type="text"
                  id="message"
                  placeholder="Type a message..."
                  autoComplete="off"
                  className="form-control"
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                />
                <button type="submit" className="primary">
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    
  );
};

export default ChatRoomItem;
