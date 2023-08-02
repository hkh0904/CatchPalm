import React, { useEffect, useRef, useState } from "react";
import {GestureRecognizer, FilesetResolver,} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import { drawLandmarks, drawConnectors } from "@mediapipe/drawing_utils";
import { Button } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import axios from "axios";

let gestureRecognizer = undefined;
let category1Name = undefined;
let category2Name = undefined;
let category1Score = undefined;
let category2Score = undefined;
let score = 0;

// mediaPipe 모션네임
const motionNames = {
  1: "Closed_Fist",
  2: "Open_Palm",
  3: "Pointing_Up",
  4: "Victory",
  5: "Thumb_Up",
  6: "Thumb_Down",
  7: "ILoveYou",
};

// Gesture Recognizer를 생성하는 비동기 함수
const createGestureRecognizer = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numHands: 2
  });
};

export default function HandModel() {
  // 컴포넌트 상태 및 ref를 선언
  const videoRef = useRef(null); // 비디오 엘리먼트를 참조하기 위한 ref
  const [category1, setCategory1] = useState("category1Name");
  const [category2, setCategory2] = useState("category2Name");
  const [showBackground, setShowBackground] = useState(false);
  const [videoHidden, setVideoHidden] = useState(false);
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 }); // 비디오의 크기를 저장하는 상태
  const [countdown, setCountdown] = useState(3);

  // 배경의 표시 상태를 토글하는 함수
  const toggleBackground = () => {
    setShowBackground(!showBackground);
    setVideoHidden(!videoHidden);
  };

  // window의 크기를 저장하는 상태
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // window의 크기가 변경될 때 windowSize 상태를 업데이트하는 함수
  const updateWindowDimensions = () => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  };

  // window의 크기가 변경될 때마다 updateWindowDimensions 함수를 실행하도록 이벤트 리스너를 등록하는 useEffect
  useEffect(() => {
    window.addEventListener("resize", updateWindowDimensions);
    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  // 웹캠 스트림을 시작하는 비동기 함수
  const handleStartStreaming = async () => {
    try {
      const height = windowSize.height;
      const width = (height * 15) / 9;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: width }, height: { ideal: height } },
      });

      videoRef.current.srcObject = stream;
      videoRef.current.width = width;
      videoRef.current.height = height;

      setVideoSize({ width, height });
    } catch (error) {
      console.error(error);
    }
  };

  // fetchData 함수를 수정하여 데이터를 가져와서 nodes에 저장하고 웹캠 위에 원 그리기
  const fetchData = async () => {
    try {
      const response = await axios.get("/music/YOASOBI-IDOL.json");
      const data = response.data; // 가져온 데이터
      data.forEach((node) => {
        setTimeout(() => {

          // circle 클래스를 가진 div를 생성합니다.
          const circleDiv = document.createElement("div");
          circleDiv.className = "circle";

          // MOTION_NUM을 확인하여 'motion' + MOTION_NUM 클래스를 추가합니다.
          circleDiv.classList.add('motion' + node.MOTION_NUM);
          
          // webcam의 위치와 크기를 얻습니다.
          const webcamWrapper = document.getElementById("webcamWrapper");
          const webcamRect = webcamWrapper.getBoundingClientRect();
          
          // console.log(circleDiv)
          // div의 위치를 설정합니다. X-COORDINATE와 Y-COORDINATE 값은 0~1 범위라고 가정합니다.
          circleDiv.style.left = `calc(${webcamRect.width -
            (webcamRect.left + node["X-COORDINATE"] * webcamRect.width)}px - 50px)`; // 40px is half of the circle's width
          circleDiv.style.top = `calc(${
            webcamRect.top + node["Y-COORDINATE"] * webcamRect.height}px - 50px)`; // 40px is half of the circle's height

          // div를 웹캠의 컨테이너인 webcamWrapper에 추가합니다.
          webcamWrapper.appendChild(circleDiv);

          // 3초 후에 생성된 div를 삭제합니다.
          setTimeout(() => {
            webcamWrapper.removeChild(circleDiv);
          }, 3000);
        }, node.APPEAR_TIME * 1000); // APPEAR_TIME은 초 단위로 가정합니다.
      });
    } catch (error) {
      console.error("Error fetching the JSON data:", error);
    }
  };

// 컴포넌트가 마운트될 때 카운트다운을 시작
useEffect(() => {
  const fetchDataAndPredict = async () => {
    fetchData();
    await createGestureRecognizer();
    await handleStartStreaming();
    await predictWebcam();
  };

  fetchDataAndPredict().then(() => {
    // 배경 음악 재생
    const audio = new Audio("/music/YOASOBI-IDOL.mp3");
    audio.volume = 0.3; // 볼륨 50%로 설정
    
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown > 1) {
          return prevCountdown - 1;
        } else {
          clearInterval(timer);
          audio.play();
          return 0;
        }
      });
    }, 500);
  });
}, []);


  // 웹캠에서 예측을 수행하는 비동기 함수
  async function predictWebcam() {
    let nowInMs = Date.now();
    let results = gestureRecognizer.recognizeForVideo(
      videoRef.current,
      nowInMs
    );

    // 캔버스에 그리기 위한 설정
    const canvasElement = document.getElementById("canvas");
    const canvasCtx = canvasElement.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    // 결과가 있다면 캔버스에 그림
    if (results.landmarks) {
      for (let landmarks of results.landmarks) {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5,
        });
        drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
      }
    }
    canvasCtx.restore();

    let handX = 0;
    let handY = 0;

    // 예측 결과를 처리
    if (results.gestures.length > 0) {
      // console.log(`x: ${results.landmarks[0][9].x.toFixed(5)}, y: ${results.landmarks[0][9].y.toFixed(5)}`);
      category1Name = results.gestures[0][0].categoryName;
      category1Score = parseFloat(results.gestures[0][0].score * 100).toFixed(2);
      setCategory1(category1Name);
      handX = results.landmarks[0][9].x;
      handY = results.landmarks[0][9].y;
      hideCircle(handX, handY, category1Name);

      // 두 번째 예측 결과가 있다면 처리
      if (results.gestures.length > 1) {
        category2Name = results.gestures[1][0].categoryName;
        category2Score = parseFloat(results.gestures[1][0].score * 100).toFixed(2);
        setCategory2(category2Name);
        handX = results.landmarks[1][9].x;
        handY = results.landmarks[1][9].y;
        hideCircle(handX, handY, category2Name);
      }
    }

    // 다음 프레임을 요청하여 계속해서 예측을 수행
    window.requestAnimationFrame(predictWebcam);
  }

  function hideCircle(handX, handY, categoryName) {
    const circleElements = document.querySelectorAll(".circle");
    circleElements.forEach((circleElement) => {
        // 원형 div의 위치를 얻습니다. (0~1 범위로 변환)
        const circleX =
            1 -
            parseFloat((parseFloat(circleElement.style.left.replace(/[^\d.]/g, ''))) + 50) /
            document.getElementById("webcamWrapper").offsetWidth;
        const circleY =
            parseFloat((parseFloat(circleElement.style.top.replace(/[^\d.]/g, ''))) + 50) /
            document.getElementById("webcamWrapper").offsetHeight;

        const motionNum = circleElement.className.split(" ")[1].replace("motion", "");

        if (motionNames[motionNum] === categoryName) { 
            // 손의 위치와 원형 div의 위치 사이의 거리를 계산합니다.
            const distance = Math.sqrt(
            Math.pow(handX - circleX, 2) + Math.pow(handY - circleY, 2)
            );
        
            // 거리가 특정 임계값 이하이면 원형 div를 삭제합니다.
            const threshold = 0.05; // 필요에 따라 이 값을 조정할 수 있습니다.
            if (distance <= threshold && circleElement.style.display !== "none") {
                circleElement.style.display = "none";
                score += 300;
            }
        }
    });
}


  // 컴포넌트의 반환 값 (렌더링 결과)
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div
        id="webcamWrapper"
        style={{
          position: "relative",
          width: videoSize.width,
          height: videoSize.height,
          backgroundImage: showBackground
          ? "url('/music/YOASOBI-IDOL.jpg')"
          : "none",
        backgroundSize: "cover",
        }}>
        <div id="score">
          <h1>Score : {score}</h1>
        </div>
        <video
          hidden={videoHidden}
          ref={videoRef}
          id="webcam"
          autoPlay
          style={{ position: "absolute", transform: "scaleX(-1)", filter: "brightness(40%)"}}/>
        <canvas
          id="canvas"
          width={videoSize.width}
          height={videoSize.height}/>
        {/* 카운트다운 표시 */}
        {countdown > 0 && (
          <div id="countdown"
              style={{ fontSize: "100px" }}>
            {countdown}
          </div>
        )}
      </div>
      <Box width={250}>
        <Card>
          <CardContent>
            <Button
              variant="contained"
              sx={{ display: "inline-flex" }}
              onClick={toggleBackground}>
              {showBackground ? "Webcam ON" : "Webcam OFF"}
            </Button>
            <div>Thats : {category1} : {category1Score}%</div>
            <div>Thats : {category2} : {category2Score}%</div>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}