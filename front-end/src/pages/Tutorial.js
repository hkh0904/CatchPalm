import React, { useEffect, useState } from 'react';
import style from './Tutorial.module.css';

function Tutorial() {
  const [isVisible, setIsVisible] = useState([false, false, false, false, false, false, false, false]);
  const texts = ['튜토리얼 페이지', '이곳은 튜토리얼 페이지입니다.', '더욱 생동감 있는 게임을 즐기시려면 F11을 눌러 주세요', '저희 CatchPalm은 화면에 나오는 히트마커에 맞춰 손모양을 인식해 점수를 올리는 게임입니다!', '(플레이 영상)', '먼저 화면과의 적당한 거리를 조절해주세요.', '인식 가능한 손모양으로 다음과 같은 7가지 모양이 있습니다', '원이 줄어드는 박자에 맞춰 손을 마커에 가져다 대고, 점수를 획득하시요!'];

  useEffect(() => {
    console.log("튜토리얼페이지");
    
    const timeoutIds = [];
    let accumulatedDelay = 0;

    texts.forEach((_, index) => {
      timeoutIds.push(setTimeout(() => {
        setIsVisible(prev => {
          const newArr = [...prev];
          newArr[index] = true;
          return newArr;
        });
      }, accumulatedDelay));

      accumulatedDelay += (texts[index] === '(플레이 영상)' || texts[index] === '먼저 화면과의 적당한 거리를 조절해주세요.') ? 5000 : 2000;

      timeoutIds.push(setTimeout(() => {
        setIsVisible(prev => {
          const newArr = [...prev];
          newArr[index] = false;
          return newArr;
        });
      }, accumulatedDelay));

      accumulatedDelay += 2000;  // 2초 간격으로 다음 글이 나오도록 설정
    });

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, []);

  return (
    <div className={style.background}>
      {texts.map((text, index) => (
        <p key={index} style={{ opacity: isVisible[index] ? 1 : 0, transition: 'opacity 0.5s' }}>
          {text}
        </p>
      ))}
    </div>
  );
}

export default Tutorial;
