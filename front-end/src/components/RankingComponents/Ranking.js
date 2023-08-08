import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';

function MyComponent() {
  const [rankList, setRankList] = useState([]);
  const [ranking, setRanking] = useState(0);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const yourMusicNumber = searchParams.get('musicNumber');

  const [userNumber, setUserNumber] = useState(''); // userNumber 상태로 추가
  const token = localStorage.getItem('token');

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
        setUserNumber(userNumber);
        console.log(userNumber);
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
            setUserNumber(userNumber);
            console.log(userNumber);
          })
          .catch(error => {
            console.log(error);
          })
      });
  }, [token]);

  useEffect(() => {
    const musicNumber = yourMusicNumber;  // 필요한 musicNumber 값

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
  }, [yourMusicNumber,userNumber]); // empty dependency array means this effect runs once on mount

  return (
    <div>
      <ul>
        {rankList && rankList.map((item, index) => 
          <li key={index}>
            Rank Number: {item.rankNumber}, Score: {item.score}, Play Date Time: {item.playDateTime}
            User: {item.userDTO.nickname}, Music: {item.musicDTO.musicName}
          </li>
        )}
      </ul>
      <p>Ranking: {ranking}</p>
    </div>
  );
}

export default MyComponent;