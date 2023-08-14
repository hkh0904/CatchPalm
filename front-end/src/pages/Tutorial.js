import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import style from './Tutorial.module.css';
import HandModel from '../components/PlayingComponents/HandModel';

function Tutorial() {
  
  const location = useLocation();
  const { gameData } = location.state; // 전달된 데이터 가져오기
  console.log(gameData); // 데이터확인.
  const navigate = useNavigate();

  // perfect, great, miss
  const [showWords, setShowWords] = useState(false);

  const timeline = [
    { start: 2, end: 7, text: "저희 CatchPalm은 화면에 나오는 히트마커에 맞춰 손모양을 인식해 점수를 올리는 게임입니다!" },
    { start: 10, end: 15, text: "먼저 화면과의 적당한 거리를 조절해주세요." },
    { start: 18, end: 30, text: "원이 줄어드는 박자에 맞춰 손을 마커에 가져다 대세요! 18~30초 사이 3개" },
    { start: 33, end: 60, text: "다음은 손모양을 모양에 맞춰 변경시켜주세요! 33~60초 사이 6개" },
    { start: 63, end: 70, text: "박자에 따라 PERFECT, GREAT, MISS 가 구분됩니다" },
    { start: 73, end: 80, text: "화면 좌측 하단에서 캐치마크가 줄어드는 속도, 효과음, 배경음악의 음량을 조절할 수 있습니다!" },
    { start: 83, end: 90, text: "만약 박자가 너무 빠르거나 느리다면 점수를 잃을수도 있습니다" },
    { start: 93, end: 98, text: "왼쪽 상단의 점수에 집중하며 정확한 타이밍을 캐치하세요!" },
    { start: 100, end: 120, text: "튜토리얼 끝!" },
    // { start: 100, end: 120, text: "추가: 손바닥이 아닌 손의 중앙에 노드가 인식되게끔 해주세용" },
    
  ];

  const [currentTime, setCurrentTime] = useState(0);
  const [currentText, setCurrentText] = useState('');


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(prevTime => prevTime + 1);
    }, 1000);


    const matchingEvent = timeline.find(event => event.start === currentTime);
    if (matchingEvent) {
      setCurrentText(matchingEvent.text);
      if (currentTime === 63) {
        setShowWords(true);
      }
    }

    const endingEvent = timeline.find(event => event.end === currentTime);
    if (endingEvent) {
      setCurrentText('');
      if (currentTime === 70) {
        setShowWords(false);
      }
    }

    return () => clearInterval(interval);
  }, [currentTime]);

  const endTutorial = () => {
    navigate('/');
  }
  
  const goTutorial = () => {
    navigate('/Playing');
  }

  return (
    <React.Fragment>
      <Grid className="mainGrid" container spacing={2} 
      style={{ backgroundColor: 'black', marginTop: 0, marginLeft: 0, position: 'relative' }}>
        <Grid item xs={12} style={{ padding: 0 }}>
          <HandModel gameData={gameData} />
        </Grid>
        <Grid item xs={12} className={style.background_tutorial}>
          {
            showWords && 
            (
              <div className={style.wordsWrapper}>
                <span className={style.PERFECT}>PERFECT<br/><br/>300</span>
                <span className={style.GREAT}>GREAT<br/><br/>200</span>
                <span className={style.MISS}>MISS<br/><br/>0</span>
              </div>
              )
            }
          <p style={{ 
            opacity: currentText ? 1 : 0, 
            transition: 'opacity 0.5s',
            fontFamily: 'Jua, sans-serif',
            fontSize: '23px' 
          }}>
            {currentText}
          </p>
          <button className={style.exitButton} onClick={endTutorial}>튜토리얼 끝내기</button>
          <button className={style.goPlaying} onClick={goTutorial}>바로 시작하기</button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Tutorial;
