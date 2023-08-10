import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Tutorial.module.css';

function Tutorial() {
  const texts = ['튜토리얼 페이지', '이곳은 튜토리얼 페이지입니다.', '더욱 생동감 있는 게임을 즐기시려면 F11을 눌러 주세요', '저희 CatchPalm은 화면에 나오는 히트마커에 맞춰 손모양을 인식해 점수를 올리는 게임입니다!', '(플레이 영상)', '먼저 화면과의 적당한 거리를 조절해주세요.', '인식 가능한 손모양으로 다음과 같은 7가지 모양이 있습니다', '원이 줄어드는 박자에 맞춰 손을 마커에 가져다 대고, 점수를 획득하시요!'];

  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const endTutorial = () => {
    navigate('/');
  }
  const goTutorial = () => {
    navigate('/Playing');
  }

  const handleNext = () => {
    if (currentIndex < texts.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }

  useEffect(() => {
    if (texts[currentIndex] !== '(플레이 영상)' && videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, [currentIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleNext();
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, [currentIndex]);

  return (
    <div className={style.background_tutorial}>
      <button className={style.exitButton} onClick={endTutorial}>튜토리얼 끝내기</button>
      <button className={style.goPlaying} onClick={goTutorial}>바로 시작하기</button>
      {texts[currentIndex] === '(플레이 영상)' ? 
        <video className={style.video_t} ref={videoRef} controls style={{ opacity: 1, transition: 'opacity 0.5s' }}>
          <source src="/assets/background.mp4" type="video/mp4" />
        </video>
      :
      <p style={{ opacity: 1, transition: 'opacity 0.5s', animation: 'fadeIn 0.5s' }}>
          {texts[currentIndex]}
        </p>
      }
      <div className={style.before_after}>
        <button onClick={handlePrev}>이전</button>
        <button onClick={handleNext}>다음</button>
      </div>
    </div>
  );
}

export default Tutorial;
