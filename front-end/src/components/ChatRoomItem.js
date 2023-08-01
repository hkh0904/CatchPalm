import React from 'react';

const ChatRoomItem = ({ room, onSelectChatRoom }) => {
  const handleSelectChatRoom = () => {
    onSelectChatRoom(room.id);
  };

  return (
    <div onClick={handleSelectChatRoom} style={{ cursor: 'pointer' }}>
      <h3>{room.title}</h3>
      <p>방장: {room.nickname}</p>
      <p>현재원/정원 {room.cntUser}/{room.capacity}</p>
      <p> 메롱</p>
      <hr />
    </div>
  );
};

export default ChatRoomItem;