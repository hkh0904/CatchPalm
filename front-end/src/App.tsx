import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Routes, Route as NestedRoute } from "react-router-dom"; // react-router-dom에서 Routes와 NestedRoute를 가져옵니다.
import PlayingPage from "./pages/PlayingPage"; // PlayingPage 컴포넌트를 불러옵니다.
import ChatRoomList from "./components/ChatRoomList"; 

const MainPage = () => {
  return (
    <div>
      <h1>메인 페이지</h1>
      <Link to="/playingPage">플레이 페이지로 이동</Link>
      <br />
      <Link to="/chatRoomList">채팅방리스트</Link>
      
    </div>
  );
};

const App = () => {
  return (
    <Router>
      {/* 메인 페이지와 PlayingPage를 라우팅합니다. */}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/playingPage" element={<PlayingPage />} />
        <Route path="/chatRoomList" element={<ChatRoomList onSelectChatRoom={undefined} />} />
      </Routes>
    </Router>
  );
};

export default App;
