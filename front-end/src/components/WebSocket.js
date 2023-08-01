import { useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

const WebSocket = ({ roomNumber, username, userNumber }) => {
  useEffect(() => {
    let client = null;

    const connect = () => {
        client = new W3CWebSocket(`ws://localhost:3000/ws/${roomNumber}`);
    
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
        console.log(username)
        console.error('WebSocket error:', e);
        // WebSocket 오류 발생 시 실행할 동작 처리
      };
    };

    // 처음 마운트될 때 WebSocket 연결 시작
    connect();

    // 컴포넌트가 언마운트될 때 WebSocket 연결 해제
    return () => {
      if (client) {
        client.close();
      }
    };
  }, [roomNumber, username, userNumber]);

  // WebSocket 컴포넌트는 렌더링할 내용이 없으므로 null을 반환
  return null;
};

export default WebSocket;