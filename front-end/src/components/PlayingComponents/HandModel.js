import React, { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "react-spring";
import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision"; // 정적 임포트
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import { drawLandmarks, drawConnectors } from "@mediapipe/drawing_utils";
import { Button } from "@mui/material";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import APPLICATION_SERVER_URL from "../../ApiConfig";

let gestureRecognizer = undefined;
let category1Name = undefined;
let category2Name = undefined;
let shouldStopPrediction = false; // 처음에는 false로 설정
let webcamWrapper = undefined;
let computedStyle = undefined;
let webcamWrapperWidth = undefined;
let circlePixel = undefined;
let circleOutPixel = undefined;

// mediaPipe 모션네임
const motionNames = {
  1: "Closed_Fist",
  2: "Open_Palm",
  3: "Pointing_Up",
  4: "Victory",
  5: "ILoveYou",
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
    numHands: 2,
  });
};

export default function HandModel({ gameData }) {
  // 컴포넌트 상태 및 ref를 선언
  const token = localStorage.getItem("token");
  const videoRef = useRef(null); // 비디오 엘리먼트를 참조하기 위한 ref
  const videoSrcRef = useRef(null);
  const showBackground = useState(false);
  const [videoHidden, setVideoHidden] = useState(Boolean(gameData.isCam));
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 }); // 비디오의 크기를 저장하는 상태
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const scoreRef = useRef(score);
  const [userNum, setUserNum] = useState(null);
  const userNumRef = useRef(userNum);
  const [musicNum, setMusicNum] = useState(null);
  const musicNumRef = useRef(musicNum);
  const location = useLocation();
  const [volume, setVolume] = useState(gameData.gameSound); // 볼륨 상태
  const audio1 = useRef(new Audio(`/music/${gameData.musicNumber}.mp3`));
  const audio2 = useRef(new Audio("/assets/Finish.mp3"));
  const [effectVolume, setEffectVolume] = useState(gameData.effectSound); // 볼륨 상태
  const missSound = useRef(new Audio("/assets/Miss.mp3"));
  const greatSound = useRef(new Audio("/assets/Great.mp3"));
  const perpectSound = useRef(new Audio("/assets/Perpect.mp3"));
  const [scaleStep, setScaleStep] = useState(gameData.synk);
  const scaleStepRef = useRef(scaleStep);
  const effectVolumeRef = useRef(effectVolume);
  const volumeRef = useRef(volume);
  const videoHiddenRef = useRef(videoHidden);

  useEffect(() => {
    scaleStepRef.current = scaleStep;
    effectVolumeRef.current = effectVolume;
    volumeRef.current = volume;
    videoHiddenRef.current = videoHidden;
  }, [scaleStep, effectVolume, volume, videoHidden]);

  useEffect(() => {
    // 볼륨 상태가 변경될 때마다 오디오 객체의 볼륨을 업데이트
    audio1.current.volume = volume;
    audio2.current.volume = effectVolume;
    missSound.current.volume = effectVolume;
    greatSound.current.volume = effectVolume;
    perpectSound.current.volume = effectVolume;
  }, [volume, effectVolume]);

  // 오디오 재생 함수
  function playSound(audioRef) {
    audioRef.current.play();
  }

  useEffect(() => {
    const unblock = window.history.pushState(null, "", window.location.href);
    window.onpopstate = function (event) {
      window.history.go(1);
      alert("게임 중 뒤로 가기는 사용할 수 없습니다."); // 알림 추가
      navigate(location);
    };

    return () => {
      window.onpopstate = null;
    };
  }, [navigate, location]);
  // 배경의 표시 상태를 토글하는 함수
  const toggleBackground = () => {
    setVideoHidden(!videoHidden);
  };

  // window의 크기를 저장하는 상태
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "정말로 페이지를 떠나시겠습니까?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    axios({
      method: "get",
      url: `${APPLICATION_SERVER_URL}/api/v1/users/me`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // your access token here
      },
    })
      .then((response) => {
        setUserNum(response.data.userNumber);
      })
      .catch((error) => {
        console.error("error");
        const token = error.response.headers.authorization.slice(7);
        localStorage.setItem("token", token);
        axios({
          method: "get",
          url: `${APPLICATION_SERVER_URL}/api/v1/users/me`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // your access token here
          },
        })
          .then((response) => {
            setUserNum(response.data.userNumber);
          })
          .catch((error) => {
            console.log(error);
          });
      });
  }, [userNum, token]);

  const sendData = async () => {
    // 객체 생성
    const data = {
      musicNumber: musicNumRef.current,
      roomNumber: gameData.roomNumber,
      score: scoreRef.current,
      userNumber: userNumRef.current,
    };
    console.log(data);
    // 헤더 설정
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      // POST 요청을 통해 데이터 전송
      const response = await axios.post(
        `${APPLICATION_SERVER_URL}/api/v1/game/log`,
        data,
        { headers: headers }
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error sending the data:", error);
    }
  };

  const sendUserData = async () => {
    const isCamValue = videoHiddenRef.current ? 1 : 0;
    const data = {
      age: "",
      backSound: "",
      effectSound: parseFloat(effectVolumeRef.current),
      gameSound: parseFloat(volumeRef.current),
      isCam: isCamValue,
      nickname: "",
      password: "",
      profileImg: "",
      profileMusic: "",
      sex: "",
      synk: scaleStepRef.current,
    };
    console.log(data);
    try {
      // POST 요청을 통해 데이터 전송
      const response = await axios.patch(
        "https://localhost:8443/api/v1/users/modify",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error sending the data:", error);
    }
  };

  // window의 크기가 변경될 때 windowSize 상태를 업데이트하는 함수
  const updateWindowDimensions = () => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  };

  // window의 크기가 변경될 때마다 updateWindowDimensions 함수를 실행하도록 이벤트 리스너를 등록하는 useEffect
  useEffect(() => {
    scoreRef.current = score; // score 값이 변경될 때마다 ref를 업데이트합니다.
    userNumRef.current = userNum;
    musicNumRef.current = musicNum;
  }, [score, userNum, musicNum]);

  const props = useSpring({
    from: { val: 0 },
    to: { val: score },
    config: { duration: 800 },
    reset: false,
  });

  const increaseScore = (amount) => {
    setScore((prevScore) => prevScore + amount);
  };

  // window의 크기가 변경될 때마다 updateWindowDimensions 함수를 실행하도록 이벤트 리스너를 등록하는 useEffect
  useEffect(() => {
    window.addEventListener("resize", updateWindowDimensions);
    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  // 컴포넌트가 마운트될 때 카운트다운을 시작
  useEffect(() => {
    shouldStopPrediction = false;
    const fetchDataAndPredict = async () => {
      const data = await fetchData(); // fetchData가 데이터를 반환하도록 수정
      await createGestureRecognizer();
      await handleStartStreaming();
      await predictWebcam();
      return data; // 데이터 반환
    };

    fetchDataAndPredict().then((data) => {
      audio1.current.loop = false;
      audio2.current.loop = false;

      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown > 1) {
            return prevCountdown - 1;
          } else {
            clearInterval(timer);
            audio1.current.play();

            if (videoSrcRef.current) {
              videoSrcRef.current.play();
            }
            createCircles(data);

            audio1.current.onended = () => {
              sendUserData();
              audio2.current.play();

              audio2.current.onended = () => {
                if (videoRef.current && videoRef.current.srcObject) {
                  const tracks = videoRef.current.srcObject.getTracks();
                  tracks.forEach((track) => track.stop());
                  shouldStopPrediction = true;
                  videoRef.current.srcObject = null;
                  sendData();
                  navigate("/");
                }
              };
            };
            return () => {
              shouldStopPrediction = true;
              videoRef.current.srcObject = null;
            };
          }
        });
      }, 500);
    });
  }, []);

  const handleVolumeChange = (e) => {
    console.log("Before:", volume);
    setVolume(e.target.value);
    console.log("After:", volume);
  };

  // 볼륨조절 함수
  const handleEffectChange = (e) => {
    setEffectVolume(e.target.value);
    missSound.current.volume = e.target.value;
    greatSound.current.volume = e.target.value;
    perpectSound.current.volume = e.target.value;
  };

  // 웹캠 스트림을 시작하는 비동기 함수
  const handleStartStreaming = async () => {
    try {
      const height = windowSize.height;
      const width = windowSize.width;

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

  // fetchData 함수를 수정하여 데이터를 가져와서 반환
  const fetchData = async () => {
    try {
      const url = `/music/${gameData.musicNumber}.json`;
      const numberString = url.split(".")[0].split("/").pop(); // "1"
      const number = parseInt(numberString, 10); // 1
      setMusicNum(number);
      const response = await axios.get(url);
      const data = response.data; // 가져온 데이터
      return data; // 데이터 반환
    } catch (error) {
      console.error("Error fetching the JSON data:", error);
    }
  };

  useEffect(() => {
    webcamWrapper = document.getElementById("webcamWrapper");
    if (webcamWrapper) {
      // 요소가 존재하는지 확인
      computedStyle = getComputedStyle(webcamWrapper);
      webcamWrapperWidth = parseFloat(computedStyle.width);
      circlePixel = webcamWrapperWidth * 0.08;
      circleOutPixel = webcamWrapperWidth * 0.18;
    }
  }, []);

  // fetchData 함수를 수정하여 데이터를 가져와서 nodes에 저장하고 웹캠 위에 원 그리기
  const createCircles = async (data) => {
    data.forEach((node) => {
      setTimeout(() => {
        // circle 클래스를 가진 div를 생성합니다.
        const circleDiv = document.createElement("div");
        circleDiv.className = "circle";

        // circle Node의 테두리 div
        const circleOut = document.createElement("div");
        circleOut.className = "circleOut";

        // MOTION_NUM을 확인하여 'motion' + MOTION_NUM 클래스를 추가합니다.
        circleDiv.classList.add("motion" + node.MOTION_NUM);

        // webcam의 위치와 크기를 얻습니다.
        const webcamRect = webcamWrapper.getBoundingClientRect();

        circleDiv.style.width = `${circlePixel}px`;
        circleDiv.style.height = `${circlePixel}px`;
        circleOut.style.width = `${circleOutPixel}px`;
        circleOut.style.height = `${circleOutPixel}px`;

        // div의 위치를 설정합니다. X-COORDINATE와 Y-COORDINATE 값은 0~1 범위라고 가정합니다.
        circleDiv.style.left = `calc(${
          webcamRect.width -
          (webcamRect.left + node["X-COORDINATE"] * webcamRect.width)
        }px - ${circlePixel / 2}px)`;
        circleDiv.style.top = `calc(${
          webcamRect.top + node["Y-COORDINATE"] * webcamRect.height
        }px - ${circlePixel / 2}px)`;
        circleOut.style.left = `calc(${
          webcamRect.width -
          (webcamRect.left + node["X-COORDINATE"] * webcamRect.width)
        }px - ${circleOutPixel / 2}px)`;
        circleOut.style.top = `calc(${
          webcamRect.top + node["Y-COORDINATE"] * webcamRect.height
        }px - ${circleOutPixel / 2}px)`;

        // div를 웹캠의 컨테이너인 webcamWrapper에 추가합니다.
        webcamWrapper.appendChild(circleDiv);
        webcamWrapper.appendChild(circleOut);

        // 애니메이션 시작
        let scale = 1;

        function animate() {
          scale -= scaleStepRef.current;
          circleOut.style.transform = `scale(${scale})`;

          if (scale > 0.2) {
            // circleDiv가 아직 DOM에 있으면 애니메이션을 계속합니다.
            if (circleDiv.parentNode) {
              requestAnimationFrame(animate);
            }
          } else {
            // circleDiv의 display 값이 none이 아닐 때만 로직 실행
            if (circleDiv.parentNode) {
              const valX =
                webcamRect.width -
                (webcamRect.left + node["X-COORDINATE"] * webcamRect.width) -
                circlePixel / 4;
              const valY =
                webcamRect.top +
                node["Y-COORDINATE"] * webcamRect.height -
                circlePixel / 4;
              showValue(valX, valY, "MISS");

              // scale이 0.2 이하가 되면 div를 삭제합니다.
              webcamWrapper.removeChild(circleDiv);
              webcamWrapper.removeChild(circleOut);
              playSound(missSound);
            }
          }
        }
        animate();
      }, node.APPEAR_TIME * 1000); // APPEAR_TIME은 초 단위로 가정합니다.
    });
  };

  // 웹캠에서 예측을 수행하는 비동기 함수
  async function predictWebcam() {
    if (shouldStopPrediction) return;
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
    // 결과가 있다면 캔버스에 그림
    if (results.landmarks) {
      canvasCtx.shadowBlur = 10; // 흐릿한 정도 설정
      canvasCtx.shadowColor = "#0fa"; // 그림자 색상 설정

      for (let landmarks of results.landmarks) {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: "white",
          lineWidth: 5,
        });
        drawLandmarks(canvasCtx, landmarks, { color: "white", lineWidth: 2 });
      }
    }
    canvasCtx.restore();

    let handX = 0;
    let handY = 0;

    // 예측 결과를 처리
    if (results.gestures.length > 0) {
      category1Name = results.gestures[0][0].categoryName;
      handX = results.landmarks[0][9].x;
      handY = results.landmarks[0][9].y;
      hideCircle(handX, handY, category1Name);

      // 두 번째 예측 결과가 있다면 처리
      if (results.gestures.length > 1) {
        category2Name = results.gestures[1][0].categoryName;
        handX = results.landmarks[1][9].x;
        handY = results.landmarks[1][9].y;
        hideCircle(handX, handY, category2Name);
      }
    }

    // shouldStopPrediction 상태가 true라면 함수 종료

    // 다음 프레임을 요청하여 계속해서 예측을 수행
    window.requestAnimationFrame(predictWebcam);
  }

  function hideCircle(handX, handY, categoryName) {
    const circleElements = document.querySelectorAll(".circle");
    circleElements.forEach((circleElement) => {
      // 원형 div의 위치를 얻습니다. (0~1 범위로 변환)
      const valX = parseFloat(circleElement.style.left.replace(/[^\d.]/g, ""));
      const valY = parseFloat(circleElement.style.top.replace(/[^\d.]/g, ""));
      const circleX =
        1 -
        parseFloat(
          parseFloat(circleElement.style.left.replace(/[^\d.]/g, "")) +
            circlePixel / 2
        ) /
          document.getElementById("webcamWrapper").offsetWidth;
      const circleY =
        parseFloat(
          parseFloat(circleElement.style.top.replace(/[^\d.]/g, "")) +
            circlePixel / 2
        ) / document.getElementById("webcamWrapper").offsetHeight;
      const motionNum = circleElement.className
        .split(" ")[1]
        .replace("motion", "");

      if (motionNames[motionNum] === categoryName) {
        // 손의 위치와 원형 div의 위치 사이의 거리를 계산합니다.
        const distance = Math.sqrt(
          Math.pow(handX - circleX, 2) + Math.pow(handY - circleY, 2)
        );

        // 거리가 특정 임계값 이하이면 원형 div를 삭제합니다.
        const threshold = 0.05; // 필요에 따라 이 값을 조정할 수 있습니다.
        if (distance <= threshold) {
          circleElement.remove();

          // circleElement와 동일한 위치에 있는 .circle-out 요소를 찾습니다.
          const circleOutElement = Array.from(
            document.querySelectorAll(".circleOut")
          ).find((element) => {
            const circleOutX =
              1 -
              parseFloat(
                parseFloat(element.style.left.replace(/[^\d.]/g, "")) +
                  circleOutPixel / 2
              ) /
                document.getElementById("webcamWrapper").offsetWidth;
            const circleOutY =
              parseFloat(
                parseFloat(element.style.top.replace(/[^\d.]/g, "")) +
                  circleOutPixel / 2
              ) / document.getElementById("webcamWrapper").offsetHeight;

            return (
              Math.abs(circleOutX - circleX) < threshold &&
              Math.abs(circleOutY - circleY) < threshold
            );
          });

          if (circleOutElement) {
            // Parse the scale value from the transform style
            let scaleValue = parseFloat(
              circleOutElement.style.transform
                .replace("scale(", "")
                .replace(")", "")
            );

            if (scaleValue >= 0.65) {
              circleOutElement.remove();
              playSound(missSound);
              showValue(valX, valY, "MISS");
            } else if (scaleValue < 0.65 && scaleValue > 0.58) {
              circleOutElement.remove();
              playSound(greatSound);
              showValue(valX, valY, "GREAT");
              increaseScore(200);
            } else if (scaleValue <= 0.58 && scaleValue >= 0.42) {
              circleOutElement.remove();
              playSound(perpectSound);
              showValue(valX, valY, "PERPECT");
              increaseScore(300);
            } else {
              circleOutElement.remove();
              playSound(greatSound);
              showValue(valX, valY, "GREAT");
              increaseScore(200);
            }
          }
        }
      }
    });
  }

  function showValue(x, y, val) {
    const webcamWrapper = document.getElementById("webcamWrapper");
    const valueDiv = document.createElement("div");
    valueDiv.classList.add("value", val);
    valueDiv.innerText = val;
    valueDiv.style.left = `${x}px`;
    valueDiv.style.top = `${y}px`;
    webcamWrapper.appendChild(valueDiv);

    setTimeout(() => {
      webcamWrapper.removeChild(valueDiv);
    }, 1000);
  }

  // 컴포넌트의 반환 값 (렌더링 결과)
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div id="loading" hidden={videoSize.width !== 0}>
        <ul className="loadul">
          <li className="loadli"></li>
          <li className="loadli"></li>
          <li className="loadli"></li>
          <li className="loadli"></li>
          <li className="loadli"></li>
        </ul>
      </div>
      <div
        id="webcamWrapper"
        hidden={videoSize.width === 0}
        style={{
          position: "relative",
        }}
      >
        <div id="score">
          <animated.div>
            {props.val.to((val) => `Score : ${Math.floor(val)}`)}
          </animated.div>
        </div>
        <video
          hidden={videoHidden} // videoHidden 상태에 따라 숨김/표시를 결정합니다.
          ref={videoSrcRef} // videoSrcRef를 사용합니다.
          id="videoSrc"
          src="/music/YOASOBI-IDOL.mp4" // 비디오 파일의 URL을 지정합니다.
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scaleX(1)",
          }}
        />
        <video
          hidden={!videoHidden}
          ref={videoRef}
          id="webcam"
          autoPlay
          width={videoSize.width}
          height={videoSize.height}
          style={{
            position: "absolute",
          }}
        />
        <canvas id="canvas" width={videoSize.width} height={videoSize.height} />
        <Button
          id="toggleWebcam"
          variant="contained"
          onClick={toggleBackground}
        >
          {showBackground ? "Webcam ON" : "Webcam OFF"}
        </Button>
        <div>
          <input
            id="volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
        <div>
          <input
            id="volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={effectVolume}
            onChange={handleEffectChange}
            style={{ bottom: "50px", left: "150px" }}
          />
        </div>
        <div>
          <input
            type="range"
            min="0.005"
            max="0.05"
            step="0.001"
            value={scaleStep} // useState로 관리하는 상태를 사용
            style={{
              bottom: "80px",
              left: "150px",
              position: "absolute",
              zIndex: 2,
            }}
            onChange={(e) => {
              const newValue = parseFloat(e.target.value);
              setScaleStep(newValue); // 상태 변경
              // setScaleStep(newValue); // state를 사용하는 경우에는 이 코드도 필요합니다.
            }}
          />
        </div>

        {countdown > 0 && <div id="countdown">{countdown}</div>}
      </div>
    </div>
  );
}
