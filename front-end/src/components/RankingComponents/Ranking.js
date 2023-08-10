import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import style from './Ranking.module.css';


let audio = null;

function MyComponent() {
  const [rankList, setRankList] = useState([]);
  const [ranking, setRanking] = useState(0);
  const [musicList,setMusicList] = useState([]);
  const [musicNumber,setMusicNumber] = useState(1);
  const [backSound,setBackSound] = useState(0);

  const [userNumber, setUserNumber] = useState(''); // userNumber 상태로 추가
  const token = localStorage.getItem('token');

  const handlePlayAudio = (index) => {
    const audioElement = document.getElementById('audioPlayer');
    audioElement.src = `/music/${index}.mp3`;
    audioElement.volume = backSound;
    audioElement.play();

    // 필요한 경우 여기에서 setMusicNumber도 호출할 수 있습니다.
    setMusicNumber(index);
  };

  useEffect(() => {
    // localStorage에서 데이터 가져오기
    const token = localStorage.getItem('token');
    axios({
      method: 'get',
      url: 'https://localhost:8443/api/v1/users/me',
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
          url: 'https://localhost:8443/api/v1/users/me',
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

  
  useEffect(()=>{
    axios.get(`https://localhost:8443/api/v1/game/music`)
      .then(response => {
        const data = response.data;
        setMusicList(data.musics);
      })
      .catch(error => {
        // error handling
        console.error('Something went wrong', error);
      });
  },[userNumber]); // empty dependency array means this effect runs once on mount

  useEffect(() => {
    axios.get(`https://localhost:8443/api/v1/game/rank?musicNumber=${musicNumber}&userNumber=${userNumber}`)
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
                          <td>{item.musicName}</td>
                          <td>{item.level}</td>
                      </tr>
                  )}
              </tbody>
            </table>
          </div>
          <div className={`${style.flex_item} ${style.item3}`}>
            <ul>
              {rankList && rankList.map((item, index) => 
                <li key={index} style={{color:`white`,fontSize:`20px`}}>
                  item3: {item.rankNumber}, Score: {item.score}, Play Date Time: {item.playDateTime}
                  User: {item.userDTO.nickname}, Music: {item.musicDTO.musicName} 안녕하세요
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className={style.leaderboard2_container}>
          <div className={`${style.flex_item} ${style.item2}`}>
            <ul>
                {musicList && musicList.map((item, index) => 
                  <li key={index} style={{color:`white`,fontSize:`20px`}}>
                    item2: {item.musicNumber}, music Name: {item.musicName}, music level: {item.level} music thumbnail: {item.thumbnail}
                  </li>
                )}
              </ul>
          </div>
          <div className={`${style.flex_item} ${style.item4}`}>
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