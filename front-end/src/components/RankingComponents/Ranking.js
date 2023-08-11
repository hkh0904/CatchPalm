import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import style from './Ranking.module.css';
import { width } from '@mui/system';
import APPLICATION_SERVER_URL from './ApiConfig';

let audio = null;

function MyComponent() {
  const [rankList, setRankList] = useState([]);
  const [ranking, setRanking] = useState();
  const [musicList,setMusicList] = useState([]);
  const [musicNumber,setMusicNumber] = useState(0);
  const [backSound,setBackSound] = useState(0);
  const [loading, setLoading] = useState(true);

  const [userNumber, setUserNumber] = useState(''); // userNumber 상태로 추가
  const token = localStorage.getItem('token');

  const handlePlayAudio = (index) => {
    const audioElement = document.getElementById('audioPlayer');
    audioElement.src = `/music/${index}.mp3`;
    audioElement.volume = backSound;
    audioElement.play();

    // 필요한 경우 여기에서 setMusicNumber도 호출할 수 있습니다.
    setMusicNumber(index-1);
  };

  useEffect(()=>{
    axios.get(`${APPLICATION_SERVER_URL}/api/v1/game/music`)
      .then(response => {
        const data = response.data;
        setMusicList(data.musics);
        setLoading(false); // 데이터를 가져오면 loading 상태를 false로 설정합니다.
      })
      .catch(error => {
        // error handling
        console.error('Something went wrong', error);
        setLoading(false); // 데이터를 가져오면 loading 상태를 false로 설정합니다.
      });
  },[userNumber]); // empty dependency array means this effect runs once on mount

  useEffect(() => {
    // localStorage에서 데이터 가져오기
    const token = localStorage.getItem('token');
    axios({
      method: 'get',
      url: `${APPLICATION_SERVER_URL}/api/v1/users/me`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // your access token here
      }
    })
      .then(response => {
        const userNumber = response.data.userNumber;
        const backSound = response.data.backSound;
        setUserNumber(userNumber);
        setBackSound(backSound);
      })
      .catch(error => {
        const errorToken = localStorage.getItem('token');
        if (!errorToken) { // token이 null 또는 undefined 또는 빈 문자열일 때
          window.location.href = '/'; // 이것은 주소창에 도메인 루트로 이동합니다. 원하는 페이지 URL로 변경하세요.
          return; // 함수 실행을 중단하고 반환합니다.
        }
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
            const userNumber = response.data.userNumber;
            const backSound = response.data.backSound;
            setUserNumber(userNumber);
            setBackSound(backSound);
          })
          .catch(error => {
            console.log(error);
          })
      });
  }, [token]);

  useEffect(() => {
    axios.get(`${APPLICATION_SERVER_URL}/api/v1/game/rank?musicNumber=${musicNumber+1}&userNumber=${userNumber}`)
      .then(response => {
        const data = response.data;
        setRankList(data.ranks);
        setRanking(data.userRanking);
      })
      .catch(error => {
        // error handling
        console.error('Something went wrong', error);
      });
  }, [musicNumber,userNumber]); // empty dependency array means this effect runs once on mount

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <div className={style.flex_container}>
      <audio id="audioPlayer" src=""></audio>
      <div className={style.horizontal_container}>
        <div className={style.leaderboard_container}>
          <div className={style.leaderboard_text}>
            <span className={style.glow}>Leader</span><span className={style.blink}> Board</span>
          </div>
          <div className={`${style.flex_item} ${style.item1}`}>
            <table style={{ color: 'white', fontSize: '20px',textAlign:'left',paddingLeft:'3%'}}>
              <thead style={{color:'wheat',fontSize:'25px'}}>
                  <tr>
                      <th style={{paddingRight:'5%'}}>Music Name : Choice Music</th>
                      <th>Music Level</th>
                  </tr>
              </thead>
              <tbody>
                  {musicList && musicList.map((item, index) => 
                      <tr className={style.neon_tr} key={index} onClick={() => handlePlayAudio(index+1)}>
                          <td style={{padding:'3px'}}>{item.musicName}</td>
                          <td>{item.level}</td>
                      </tr>
                  )}
              </tbody>
            </table>
          </div>
          <div className={`${style.flex_item} ${style.item3} ${style.itemContainer}`}>
            <img src={musicList[musicNumber].thumbnail} alt="no-img" style={{width:'63%',verticalAlign: 'top',paddingLeft:'1%',paddingTop:'1%'}}></img>
            <div className={style.textContainer} style={{paddingLeft:'2%',paddingTop:'2%'}}>
              <span className={style.music_detail} style={{color:'lime', fontSize:'28px'}}>{musicList[musicNumber].musicName}</span><br></br><br></br>
              <span className={style.music_head}>Singer: </span>
              <span className={style.music_detail}>{musicList[musicNumber].singer}</span><br></br>
              <span className={style.music_head}>Level: </span>
              <span className={style.music_detail}>{musicList[musicNumber].level}</span><br></br>
              <span className={style.music_head}>Release Date: </span><br></br>
              <span className={style.music_detail}>{musicList[musicNumber].releaseDate}</span><br></br>
              <span className={style.music_head}>Running Time: </span><br></br>
              <span className={style.music_detail}>{musicList[musicNumber].runningTime.slice(3)}</span><br></br>
            </div>
          </div>
        </div>
        <div className={style.leaderboard2_container}>
          <div className={`${style.flex_item} ${style.item2}`}>
          <table style={{ color: 'white', fontSize: '20px',textAlign:'left',padding:'1%',justifyContent:'center',borderCollapse:'separate'}}>
              <thead style={{color:'wheat',fontSize:'25px'}}>
                  <tr >
                      <th style={{width:'10%',paddingLeft:'10px',paddingTop:'5px',paddingBottom:'5px'}}>Ranking</th>
                      <th style={{width:'25%',paddingLeft:'10px',paddingTop:'5px',paddingBottom:'5px'}}>Nickname</th>
                      <th style={{width:'20%',paddingLeft:'10px',paddingTop:'5px',paddingBottom:'5px'}}>Score</th>
                      <th style={{width:'9%',paddingRight:'3%',paddingLeft:'10px',paddingTop:'5px',paddingBottom:'5px'}}>Date</th>
                  </tr>
              </thead>
              <tbody>
                  {rankList && rankList.map((item, index) => 
                      <tr  key={index} className={index % 2 === 0 ? style.rowColor1 : style.rowColor2}>
                          <td style={{paddingLeft:'10px',color:'#ffd700',paddingLeft:'10px',paddingTop:'5px',paddingBottom:'5px'}}>{index+1}</td>
                          <td style={{paddingLeft:'10px',paddingTop:'5px',paddingBottom:'5px'}}>{item.userDTO.nickname}</td>
                          <td style={{paddingLeft:'10px',paddingTop:'5px',paddingBottom:'5px'}}>{item.score}</td>
                          <td style={{paddingLeft:'10px',paddingTop:'5px',paddingBottom:'5px'}}>{item.playDateTime.slice(0, 10)}</td>
                      </tr>
                  )}
              </tbody>
            </table>
          </div>
          <div className={`${style.flex_item} ${style.item4}`}>
          <div className={style.leaderboard_text} style={{color:'red',fontSize:'40px',fontStyle:'inherit'}}>
            <span className={style.glow}>My Ranking</span>
          </div>
          <table style={{ color: 'white', fontSize: '20px',textAlign:'left',padding:'2%',justifyContent:'center',borderCollapse:'separate'}}>
              <tbody>
              {ranking> 0 ? (
                  <tr className={style.rowColor1}>
                    <td style={{paddingLeft:'5px',color:'#ffd700',width:'10%',paddingLeft:'10px',paddingTop:'5px',paddingBottom:'5px'}}>{ranking}</td>
                    <td style={{width:'25%',paddingLeft:'10px',paddingTop:'5px',paddingBottom:'5px'}}>{rankList[ranking-1].userDTO.nickname}</td>
                    <td style={{width:'20%',paddingLeft:'10px',paddingTop:'5px',paddingBottom:'5px'}}>{rankList[ranking-1].score}</td>
                    <td style={{width:'9%',paddingLeft:'10px',paddingTop:'5px',paddingBottom:'5px'}}>{rankList[ranking-1].playDateTime.slice(0, 10)}</td>
                  </tr>
                ) : (
                <tr>
                  <td colSpan="4">No Records Found</td>
                </tr>
              )}
              </tbody>
            </table>
            <ul>
                {musicList && musicList.map((item, index) => 
                  <li key={index} style={{color:`white`,fontSize:`20px`}}>
                    item2: {item.musicNumber}, music Name: {item.musicName}, music level: {item.level} music thumbnail: {item.thumbnail}
                  </li>
                )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyComponent;