import React, { useEffect } from 'react';


function Tutorial() {
  // 페이지가 로드될 때 console.log 메시지 출력
  useEffect(() => {
    console.log("튜토리얼페이지");
  }, []);  // 빈 dependency 배열을 사용하여 컴포넌트가 마운트될 때만 메시지를 출력

  return (
    <div>
      <h1>튜토리얼 페이지</h1>
      <p>이곳은 튜토리얼 페이지입니다.</p>
      
      <p>
      더욱 생동감 있는 게임을 즐기시려면 F11을 눌러 주세요
      </p>
      
     <p>
      저희 CatchPalm은 화면에 나오는 히트마커에 맞춰 손모양을 인식해 점수를 올리는 게임입니다!
    </p> 
            
    <p>  
      (플레이 영상)
    </p>

    <p>
      인식 가능한 손모양으로 다음과 같은 7가지 모양이 있습니다
    </p>
  
    <p>
      원이 줄어드는 박자에 맞춰 손을 마커에 가져다 대고, 점수를 획득하시요!
    </p>
    </div>
  );
}

export default Tutorial;
