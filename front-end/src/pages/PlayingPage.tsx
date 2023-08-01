import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { css } from "@emotion/css";
import { Camera } from "@mediapipe/camera_utils";
import { Hands, Results } from "@mediapipe/hands";
import { drawCanvas } from "../utils/drawCanvas";

const PlayingPage = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultsRef = useRef<Results>();
  const navigate = useNavigate(); // useNavigate 훅을 이용하여 프로그래밍적으로 페이지를 이동할 수 있도록 가져옵니다.
  const [jsonData, setJsonData] = useState<any[]>([]);

  /**
   * 검출결과（프레임마다 호출됨）
   * @param results
   */
  const onResults = useCallback((results: Results) => {
    resultsRef.current = results;

    const canvasCtx = canvasRef.current!.getContext("2d")!;
    drawCanvas(canvasCtx, results);
  }, []);

  // 초기설정
  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(onResults);

    if (webcamRef.current) {
      const camera = new Camera(webcamRef.current.video!, {
        onFrame: async () => {
          await hands.send({ image: webcamRef.current!.video! });
        },
        width: window.innerWidth, // 사용자의 화면 가로 크기로 설정
        height: window.innerHeight, // 사용자의 화면 세로 크기로 설정
      });
      camera.start();
    }
  }, [onResults]);


  // PlayingPage가 언마운트(unmount)될 때 webcamRef를 해제합니다.
  useEffect(() => {
    return () => {
      if (webcamRef.current && webcamRef.current.video) {
        const videoElement = webcamRef.current.video;
        const stream = videoElement.srcObject as MediaStream;
        const tracks = stream?.getTracks();
        if (tracks) {
          tracks.forEach((track) => track.stop());
        }
        videoElement.srcObject = null;
      }
    };
  }, []);

  /* 랜드마크들의 좌표를 콘솔에 출력 */
  const OutputData = () => {
    const results = resultsRef.current!;
    console.log(results.multiHandLandmarks);
  };

  const WebcamToggle = () => {

  }

  // 메인 페이지로 돌아가는 함수를 정의합니다.
  const goBackToMainPage = () => {
    navigate("/");
  };

  // JSON 데이터를 가져오는 함수
  const fetchData = async () => {
    try {
      const response = await fetch("/assets/YOASOBI-IDOL.json"); // JSON 파일의 경로를 수정해주세요.
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData: any[] = await response.json();
      console.log(jsonData);
      setJsonData(jsonData);
    } catch (error) {
      console.error("Error fetching JSON:", error);
    }
  };

  // 컴포넌트가 마운트될 때 JSON 데이터를 가져옵니다.
  useEffect(() => {
    fetchData();
  }, []);

  // jsonData를 이용하여 원하는 작업을 진행하시면 됩니다.

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* 비디오 캡쳐 */}
        <Webcam
          audio={false}
          style={{ visibility: "hidden" }}
          width={1280}
          height={720}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ width: 1280, height: 720, facingMode: "user" }}
        />
        {/* 랜드마크를 손에 표시 */}
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={1280}
          height={720}
        />
        {/* 좌표 출력 */}
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={OutputData}>
            Output Data
          </button>
          <button className={styles.button} onClick={WebcamToggle}>
            WebCam ON/OFF
          </button>
          {/* 메인 페이지로 돌아가는 버튼 */}
          <button className={styles.button} onClick={goBackToMainPage}>
            메인 페이지
          </button>
        </div>
      </div>
      <div id="sidebar" className={styles.sidebar}>
        <p>사이드바 ( 다른플레이어 )</p>
      </div>
    </div>
  );
  
};

// ==============================================
// styles
const styles = {
  page: css`
    display: flex;
    width: 100vw;
    height: 100vh;
  `,
  container: css`
    position: relative;
    width: 75vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: auto;
  `,
  sidebar: css`
    width: 25vw;
    height: 100vh;
    /* 이곳에 빈 공간의 스타일을 추가하세요 */
  `,

  canvas: css`
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #fff;
  `,
  buttonContainer: css`
    position: absolute;
    top: 20px;
    left: 20px;
  `,
  button: css`
    color: #fff;
    background-color: #0082cf;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    padding: 10px 10px;
    cursor: pointer;
    margin-right: 10px;
  `,
};

export default PlayingPage;