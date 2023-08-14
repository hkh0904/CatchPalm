// import './App.css'; // 필요한 경우 주석을 제거하고 사용하세요.
import React, { useEffect, useState } from 'react';
import style from "./App.module.css";
import { BrowserRouter as Router, Route, Routes,Link} from 'react-router-dom';
import Grid from '@mui/material/Grid';
import PlayingPage from './pages/PlayingPage';
import ChatRoomItem from "./pages/ChatRoomPage";
import ChatRoomList from "./components/ChatRoomComponents/ChatRoomList"; // chat 리스트방으로
import { Button, Drawer } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Userinfo from './pages/Userinfo';
import Tutorial from './pages/Tutorial';
import RankingPage from './pages/RankingPage';
import ResultPage from './pages/ResultPage';
import axios from 'axios';
import APPLICATION_SERVER_URL from './ApiConfig';
import { useLocation } from 'react-router-dom';
import Swal from "sweetalert2"

//const APPLICATION_SERVER_URL = process.env.NODE_ENV === 'https://i9c206.p.ssafy.io/api' ? '' : 'https://localhost:8443';
let CreatedroomNumber = ''; // 전역 변수로 선언
function MainPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tokenValue = searchParams.get('token');

  if(tokenValue){
    localStorage.setItem('token', searchParams.get('token'));
    navigate("/");
  }

  // 메인 버튼
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
    

  ////////로그인 로그아웃 시작////////////////
  const isLoggedIn = !!localStorage.getItem('token'); 
  // const isLoggedIn = 1;  // 로그인 토큰 확인


  const handleLogout = () => {
    localStorage.removeItem('token'); // 토큰 삭제
    navigate('/');
  };

    // 버튼 클릭 상태를 추적하는 useState 추가
    const [buttonClicked, setButtonClicked] = useState(false);  

    const handleCircleButtonClick = () => {
      setButtonClicked(true);
              // 효과음 재생
        const audioElement = document.getElementById("startSound");
        if (audioElement) {
            audioElement.play();
        }

    }
    //// 내 정보보기 시작
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerOpen = () => {
      setDrawerOpen(!drawerOpen);
    };

    /// 내정보 보기 끝


  // const handleButtonClick3 = () => {
  //   navigate('/login');
  // };
  
  // const handleButtonClick4 = () => {
  //   navigate('/signup');
  // };
  ////////////// 로그인 로그아웃 끝////////////////  

  ////로그인 회원가임 Drawer

    // 드로어 내용을 결정할 useState 추가
    const [drawerContent, setDrawerContent] = useState(null);

    const openLoginDrawer = () => {
        setDrawerContent("login");
        handleDrawerOpen();
    };

    const openSignupDrawer = () => {
        setDrawerContent("signup");
        handleDrawerOpen();
    };


  //////// 회원정보 받아오기 시작/////////
  const [userId, setUserId] = useState(null);
  const token = localStorage.getItem('token');

  const [userNickname, setuserNickname] = useState(null);
  const [userNumber, setUserNumber] = useState(null);


  useEffect(() => {
    // 카메라 권한 요청
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        // 스트림 처리 코드 (예: 비디오 요소에 스트림 연결)
        console.log("Camera access granted");
        // 스트림 종료
        stream.getTracks().forEach(track => track.stop());
      })
      .catch((error) => {
        console.error("Camera access denied:", error);
        Swal.fire({
          icon: "warning",
          title: "CatchPalm에는 웹캠이 필요해요!",
          // text: "방 제목을 입력 해주세요",
        });
      });
  }, []);


  useEffect(() => {
    
    const currentUrl = window.location.href;
    console.log(currentUrl);
    
    // url에서 파싱해서 token 받아오기
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check if token parameter is present in the URL
    let urlToken = urlParams.get('token');
    
    if (urlToken) {
      // 만약 주소 뒤에 token이러는게 있다면,
      localStorage.setItem('token', urlToken);
      window.location.href = 'http://localhost:3000/';
    } else {
      
      if(!token) return;  // 토큰이 없으면 요청하지 않습니다. >> 원래 하던 방식대로 로그인
  
      axios({
        method: 'get',
        url: `${APPLICATION_SERVER_URL}/api/v1/users/me`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // your access token here
        }
      })
      .then(response => {
        const rawUserId = response.data.userId;
        const cleanedUserId = rawUserId.replace('local:', ''); // 앞에 local: 지우기
        const userNumber = response.data.userNumber;
        const userNickname = response.data.userNickname;
        setuserNickname(userNickname);
        setUserNumber(userNumber);
        setUserId(cleanedUserId);
      })
      .catch(error => {
        const token = error.response.headers.authorization.slice(7);
        localStorage.setItem('token', token);
        axios({
          method: 'get',
          url: `${APPLICATION_SERVER_URL}/api/v1/users/me`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // your access token here
          }
        })
          .then(response => {
            const rawUserId = response.data.userId;
            const cleanedUserId = rawUserId.replace('local:', ''); // 앞에 local: 지우기
            const userNumber = response.data.userNumber;
            const userNickname = response.data.userNickname;
            setuserNickname(userNickname);
            setUserNumber(userNumber);  
            setUserId(cleanedUserId);
          })
          .catch(error => {
            console.log(error);
          })
      });
    }
  }, [token]);
  
  

///////회원정보 받아오기 끝////////////  
  const handleButtonClick = () => {
    navigate('/Playing');
  };
  
  const buttonClasses = isHovered ? style.button + ' ' + style.hovered : style.button;

  
  const handleEnterChatRoom = (roomNumber) => {
    navigate(`/chat-rooms/${roomNumber}`);
  };

  const [roomData, setRoomData] = useState({
    capacity: '',
    categoryNumber: '',
    password: '',
    title: '',
    userNumber: userNumber,
    roomNumber: ''
  });

  useEffect(() => {
      setRoomData({
        capacity: 1,
        categoryNumber: 2,
        password: '',
        title: userNickname,
        userNumber: userNumber,
        roomNumber: ''
      });
  }, [userNumber]);

  const handleCreateRoom = async (roomData) => {
    console.log(roomData)
    try {
      const response = await axios.post(`${APPLICATION_SERVER_URL}/api/v1/gameRooms/create`, roomData);
      CreatedroomNumber = response.data.roomNumber;
      handleEnterChatRoom(CreatedroomNumber);
      
    } catch (error) {
      console.error('Error craating a new room:', error);
    }
  };

  return (
    <React.Fragment>
        {/* background_video에 클릭 상태에 따른 클래스 조건부 추가 */}
        <video 
          autoPlay muted loop 
          className={`${style.background_video} ${buttonClicked ? style.clicked : ""}`}
        >
          <source src="assets/background.mp4" type="video/mp4" />
        </video>

      <div className={style.mainword}>
        <h2>프로젝트 소개</h2>
      </div>
      {/* 메인버튼 */}
      <div>
      {/* <button
        className={buttonClasses}
        onMouseEnter={handleHover}
        onMouseLeave={handleMouseLeave}
      >
        <p className={style.main_font}>Catch Palm</p>
      </button> */}
    </div>
          {isLoggedIn ? (
            <React.Fragment>
            <div className={style.gamemode} container spacing={2}>
              
                <a href="tutorial" className={style.a}>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  TUTORIAL
                </a>
                <a className={style.a} onClick={() => { handleCreateRoom(roomData);}}>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  SOLO MODE
                </a>
                <a href="/ChatRoomList" className={style.a}>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  MULTI MODE
                </a>
                <a href="/ranking" className={style.a}>
                  
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  ranking
                </a>
              </div>
              <button variant="contained" onClick={handleButtonClick}>
                Go to Sample Page
              </button>
              <br />
              <button onClick={handleButtonClick}>게임시작</button>
              <div className={`${style.logout}`}>
                <button onClick={handleLogout}>
                  로그아웃
                </button>
              </div>
              <div className={`${style.userinfo}`}>
                  <img 
                      src="/assets/user_profile.png" 
                      alt="User Profile" 
                      onClick={handleDrawerOpen}
                      style={{ cursor: 'pointer' }}  // 이미지가 클릭 가능하다는 것을 나타내기 위한 스타일
                  />
              </div>
              
              <div className={`${style.white_text}`}>
                <p>아이디: {userId}</p>
              </div>

              <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerOpen}>
                <Userinfo />
              </Drawer>
              
            </React.Fragment>
          ) : (
            <React.Fragment>
            <div className={style.gamemode} container spacing={2}>
              <a href="#" className={style.a} onClick={openLoginDrawer}>              
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                LOGIN
              </a>
              <br/>
              <a href="#" className={style.a} onClick={openSignupDrawer}>
                
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                SIGN UP
              </a>
            </div>

              <div className={`${style.background_image} ${buttonClicked ? style.clicked : ""}`}></div>
              <audio id="startSound" src="/assets/Start.mp3" preload="auto"></audio>
              <button className={`${style.centeredCircleButton} ${buttonClicked ? style.clicked : ""}`} 
                onClick={handleCircleButtonClick}>
              </button>
              <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerOpen}>
                {drawerContent === "login" && <Login />}
                {drawerContent === "signup" && <SignUp />}
              </Drawer>
          </React.Fragment>
          )}
        
    </React.Fragment>
  );
}

function App() {
  
  return (
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/userinfo" element={<Userinfo />} />
          <Route path="/Playing" element={<PlayingPage />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/chatRoomList" element={<ChatRoomList onSelectChatRoom={undefined} />} />
          <Route path="/chat-rooms/:roomNumber" element={<ChatRoomItem />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
    </Router>
  );
}

export default App;