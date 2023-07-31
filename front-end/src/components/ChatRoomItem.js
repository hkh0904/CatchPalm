import React from 'react';

const ChatRoomItem = ({ room, onSelectChatRoom }) => {
  const handleSelectChatRoom = () => {
    onSelectChatRoom(room.id); 
  };

  return (
    <div onClick={handleSelectChatRoom}>
      <h3>{room.id} {room.name}</h3>
      {/* <p>Participants: {room.participants.join(', ')}</p> */}
    </div>
  );
};

export default ChatRoomItem;