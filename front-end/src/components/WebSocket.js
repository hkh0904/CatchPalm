import { useEffect, useState, useRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

const WebSocket = ({ roomNumber, username, userNumber }) => {
  const [newMessage, setNewMessage] = useState('');
  const clientRef = useRef(null);

  useEffect(() => {
    const connect = () => {
      const client = new W3CWebSocket(`ws://localhost:8080/ws`);

      client.onopen = () => {
        console.log('WebSocket connection opened');
        const joinMessage = {
          sender: username,
          type: 'JOIN',
          userNum: userNumber,
          roomNumber: roomNumber,
        };
        client.send(JSON.stringify(joinMessage));
      };

      client.onmessage = (e) => {
        const message = JSON.parse(e.data);
        console.log('Received message:', message);
        // 메시지를 받았을 때 실행할 동작 처리
      };

      client.onclose = () => {
        console.log('WebSocket connection closed');
        // WebSocket이 닫혔을 때 실행할 동작 처리
      };

      client.onerror = (e) => {
        console.error('WebSocket error:', e);
        // WebSocket 오류 발생 시 실행할 동작 처리
      };

      // useRef를 사용하여 clientRef에 할당
      clientRef.current = client;
    };

    // 처음 마운트될 때 WebSocket 연결 시작
    connect();

    // 컴포넌트가 언마운트될 때 WebSocket 연결 해제
    return () => {
      const client = clientRef.current;
      if (client) {
        client.close();
      }
    };
  }, [roomNumber, username, userNumber]);

  // 메시지를 서버로 보내는 함수
  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      const message = {
        sender: username,
        type: 'MESSAGE',
        content: newMessage.trim(),
        userNum: userNumber,
        roomNumber: roomNumber,
      };
      const client = clientRef.current;
      if (client) {
        client.send(JSON.stringify(message));
        setNewMessage('');
      }
    }
  };

  // WebSocket 컴포넌트는 렌더링할 내용이 없으므로 null을 반환
  return null;
};

export default WebSocket;
