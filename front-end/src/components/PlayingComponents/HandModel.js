import React, { useEffect, useRef, useState } from "react";
import { GestureRecognizer, FilesetResolver } from "@mediapipe/tasks-vision";
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
let vision = undefined;

// Gesture Recognizer를 생성하는 비동기 함수
const createGestureRecognizer = async () => {
  vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
    },
    runningMode: "VIDEO",
    numHands: 2,
  });
};

export default function HandModel() {
  // 컴포넌트 상태 및 ref를 선언
  const videoRef = useRef(null); // 비디오 엘리먼트를 참조하기 위한 ref
  const [category1, setCategory1] = useState("category1Name");
  const [category2, setCategory2] = useState("category2Name");
  const [doPredictionsBtn, setBtn] = useState("Start");
  const [nodes, setNodes] = useState([]);
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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      const track = stream.getVideoTracks()[0];
      const settings = track.getSettings();

      // 비디오의 비율을 계산하고 크기를 설정
      const aspectRatio =
        settings.aspectRatio || settings.width / settings.height;
      const height = windowSize.height;
      const width = height * aspectRatio;

      videoRef.current.srcObject = stream;
      videoRef.current.width = width;
      videoRef.current.height = height;

      setVideoSize({ width, height });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("/music/YOASOBI-IDOL.json");
      setNodes(response.data);

      const canvasElement = document.getElementById("video_out");
      const canvasCtx = canvasElement.getContext("2d");

      // 데이터를 APPEAR_TIME에 따라 출력
      response.data.forEach((node) => {
        setTimeout(() => {
          // 원을 그립니다.
          const centerX = canvasElement.width / 2;
          const centerY = canvasElement.height / 2;

          canvasCtx.beginPath();
          canvasCtx.arc(centerX, centerY, 40, 0, Math.PI * 2, true);
          canvasCtx.fillStyle = "green";
          canvasCtx.fill();

          // 로그를 출력합니다.
          console.log(`Drawn a circle at (${centerX}, ${centerY})`);
        }, node.APPEAR_TIME * 1000);
      });
    } catch (error) {
      console.error("Error fetching the JSON data:", error);
    }
  };

  // 컴포넌트가 마운트될 때 카운트다운을 시작
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // 카운트다운이 끝나면 원하는 작업 수행
      predictWebcam();
      fetchData(); // 카운트다운이 끝난 후에 데이터를 가져옴
    }
  }, [countdown]);

  // 컴포넌트가 마운트 될 때 실행되는 useEffect
  useEffect(() => {
    createGestureRecognizer();
    handleStartStreaming();
  }, []);

  // 웹캠에서 예측을 수행하는 비동기 함수
  async function predictWebcam() {
    let nowInMs = Date.now();
    let results = gestureRecognizer.recognizeForVideo(
      videoRef.current,
      nowInMs
    );

    // 캔버스에 그리기 위한 설정
    const canvasElement = document.getElementById("video_out");
    const canvasCtx = canvasElement.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    // 결과가 있다면 캔버스에 그림
    if (results.landmarks) {
      for (let landmarks of results.landmarks) {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 2,
        });
        drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 1 });
      }
    }
    canvasCtx.restore();

    // 예측 결과를 처리
    if (results.gestures.length > 0) {
      // console.log(results.landmarks[0][9].x, results.landmarks[0][9].y);
      category1Name = results.gestures[0][0].categoryName;
      category1Score = parseFloat(results.gestures[0][0].score * 100).toFixed(
        2
      );
      setCategory1(category1Name);

      // 두 번째 예측 결과가 있다면 처리
      if (results.gestures.length > 1) {
        category2Name = results.gestures[1][0].categoryName;
        category2Score = parseFloat(results.gestures[1][0].score * 100).toFixed(
          2
        );
        setCategory2(category2Name);
      }
    }

    // 다음 프레임을 요청하여 계속해서 예측을 수행
    window.requestAnimationFrame(predictWebcam);
  }

  // 컴포넌트의 반환 값 (렌더링 결과)
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div
        style={{
          position: "relative",
          width: videoSize.width,
          height: videoSize.height,
        }}
      >
        <video
          hidden={videoHidden}
          ref={videoRef}
          id="video_in"
          autoPlay
          style={{ position: "absolute", transform: "scaleX(-1)" }}
        />
        <canvas
          id="video_out"
          width={videoSize.width}
          height={videoSize.height}
          style={{
            position: "absolute",
            transform: "scaleX(-1)",
            backgroundImage: showBackground
              ? "url('/music/YOASOBI-IDOL.jpg')"
              : "none",
            backgroundSize: "cover",
          }}
        />
        {/* 카운트다운 표시 */}
        {countdown > 0 && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "100px",
              color: "white",
            }}
          >
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
              onClick={toggleBackground}
            >
              {showBackground ? "Webcam ON" : "Webcam OFF"}
            </Button>
            <div>
              Thats : {category1} : {category1Score}%
            </div>
            <div>
              Thats : {category2} : {category2Score}%
            </div>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}

// 해당 코드는 대부분 비동기 처리와 React 훅을 잘 사용하여 작성된 것으로 보입니다. 따라서, 일반적인 성능 최적화에 집중하는 것보다는 코드의 구조와 목적에 따라 최적화하는 것이 더 효과적일 수 있습니다.

// 아래는 몇 가지 가능한 최적화 방법입니다:

// 1. **비동기 처리 개선:** 코드에서 볼 수 있듯이, `fetchData`, `createGestureRecognizer`, `handleStartStreaming` 등의 함수들은 비동기적으로 동작합니다. 이들 함수의 처리 시간이 길어질 경우 앱의 전체적인 반응성에 영향을 미칠 수 있습니다. 따라서 이러한 함수들이 렌더링 로직과 밀접하게 연관되지 않도록 하거나, 필요한 경우 Web Worker를 사용하여 별도의 스레드에서 실행되도록 하는 것이 좋습니다.

// 2. **불필요한 렌더링 방지:** 현재 `useEffect` 훅 내에서 여러 상태를 변경하고 있습니다. 이로 인해 컴포넌트가 불필요하게 여러 번 렌더링될 수 있습니다. `useEffect` 내에서 상태를 한 번에 변경하거나, 상태 변경 로직을 `useReducer` 훅을 사용하는 등의 방식으로 리팩토링하는 것이 좋습니다.

// 3. **함수 메모이제이션:** `useCallback` 또는 `useMemo` 훅을 사용하여 함수를 메모이제이션하면 성능을 향상시킬 수 있습니다. 예를 들어, `handleStartStreaming`, `handleDoPredictions` 등의 함수는 컴포넌트가 리렌더링될 때마다 새로 생성되는데, 이런 경우 해당 함수를 `useCallback`으로 감싸서 메모이제이션하면 성능을 향상시킬 수 있습니다.

// 4. **반복적인 DOM 접근 최소화:** `predictWebcam` 함수에서 `document.getElementById("video_out")`를 통해 동일한 DOM 요소에 반복적으로 접근하고 있습니다. 이는 성능에 부정적인 영향을 미칠 수 있습니다. 따라서 `useRef` 훅을 사용하여 한 번만 참조를 가져온 후 재사용하는 것이 좋습니다.

// 다시 한번 강조하지만, 이러한 최적화 방법은 일반적인 것들이며, 실제 성능 향상을 위해서는 개발자 도구를 활용하여 성능 병목을 식별하고 그에 따라 최적화를 진행하는 것이 중요합니다.
