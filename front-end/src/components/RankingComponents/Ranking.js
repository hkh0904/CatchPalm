import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';

function MyComponent() {
  const [rankList, setRankList] = useState([]);
  const [ranking, setRanking] = useState(0);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const yourMusicNumber = searchParams.get('musicNumber');

  useEffect(() => {
    const musicNumber = yourMusicNumber;  // 필요한 musicNumber 값
    const userNumber = 1; // 필요한 userNumber 값 (optional)

    axios.get(`https://localhost:8443/api/v1/game/rank?musicNumber=${musicNumber}`)
      .then(response => {
        const data = response.data;
        setRankList(data.ranks);
        setRanking(data.userRanking);
      })
      .catch(error => {
        // error handling
        console.error('Something went wrong', error);
      });
  }, [yourMusicNumber]); // empty dependency array means this effect runs once on mount

  return (
    <div>
      <ul>
        {rankList && rankList.map((item, index) => 
          <li key={index}>
            Rank Number: {item.rankNumber}, Score: {item.score}, Play Date Time: {item.playDateTime}
            User: {item.userDTO.nickname}, Music: {item.musicDTO.musicName}  // assuming `username` and `title` exist in userDTO and musicDTO
          </li>
        )}
      </ul>
      <p>Ranking: {ranking}</p>
    </div>
  );
}

export default MyComponent;