import React, { useState, useEffect, useRef } from 'react';
import './ChatRoomItem.css'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import { allResolved } from 'q';

var stompClient =null;
var colors = [
  '#2196F3', '#32c787', '#00BCD4', '#ff5652',
  '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

const ChatRoomItem = () => {
  const messageAreaRef = useRef(null);
  const { roomNumber } = useParams();
  const [roomInfo, setRoomInfo] = useState(null);

  const [name, setName] = useState('');
  const [userNumber, setUserNumber] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
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
        const response = await axios.get(`https://localhost:8443/api/v1/gameRooms/getGameRoomInfo/${roomNumber}`);
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
  
  // 소켓연결---------------------------------
  const connect =()=>{
    let Sock = new SockJS('https://localhost:8443/ws');
    stompClient = over(Sock);
    stompClient.connect({},onConnected, onError);
  }
  // 연결 됬다면 구독 매핑 및 연결 유저 정보 전송
  const onConnected = () => {
    stompClient.subscribe(`/topic/chat/${roomNumber}`, onMessageReceived);
    alert("성공 시발");
    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({sender: name, type: 'JOIN', userNumber: userNumber, roomNumber: roomNumber})
    )
    handleToggleVisibility();
  }
  // 연결이 안된경우
  const onError = (err) => {
    console.log(err);
    alert("실패시발 "+userNumber+" "+roomNumber + " "+name);
  }

  // 서버에서 메세지 수신

  const onMessageReceived = (payload) => {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');

    if (message.type === 'JOIN') {
      messageElement.classList.add('event-message');
      message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
      messageElement.classList.add('event-message');
      message.content = message.sender + ' left!';
    } else {
      messageElement.classList.add('chat-message');

      var avatarElement = document.createElement('i');
      var avatarText = document.createTextNode(message.sender[0]);
      avatarElement.appendChild(avatarText);
      avatarElement.style.backgroundColor = getAvatarColor(message.sender);

      messageElement.appendChild(avatarElement);

      var usernameElement = document.createElement('span');
      var usernameText = document.createTextNode(message.sender);
      usernameElement.appendChild(usernameText);
      messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageAreaRef.current.appendChild(messageElement);
    messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
  };

  const getAvatarColor = (messageSender) => {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
      hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
  };

  const handleStartChatting=()=>{
    connect();
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
      {!isVisible &&
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
              <button type="button" className="accent username-submit" onClick={handleStartChatting}>
                Start Chatting
              </button>
            </div>
          </form>
        </div>
      </div> }
      {isVisible &&
      <div id="chat-page" className="hidden">
        <div className="chat-container">
          <div className="chat-header">
            <h2 id="roomN">Spring WebSocket Chat Demo - By 민우짱</h2>
          </div>
          <div className="connecting">Connecting...</div>
          <ul ref={messageAreaRef}></ul>
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
      </div> }
    </div>

    
  );
};

export default ChatRoomItem;
