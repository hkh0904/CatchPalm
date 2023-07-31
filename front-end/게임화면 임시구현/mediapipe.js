import {
  GestureRecognizer,
  FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0"; // 미디어파이프 받아오기
// const demosSection = document.getElementById("demos");
let gestureRecognizer;
let runningMode = "IMAGE";
let enableWebcamButton;
let webcamRunning = false;


// HandLandmarker 클래스를 사용하기 전에 로딩이 완료되어야 합니다.
// 머신 러닝 모델은 크기가 크고 실행에 필요한 모든 요소를 가져오는 데 시간이 걸릴 수 있습니다.

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
    runningMode: runningMode,
  });
};
createGestureRecognizer();

const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");
const gestureOutput = document.getElementById("gesture_output");

let videoHeight = window.innerHeight;
let videoWidth = window.innerWidth;

// Check if webcam access is supported.
function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}
// If webcam supported, add event listener to button for when user
// wants to activate it.
if (hasGetUserMedia()) {
  enableWebcamButton = document.getElementById("webcamButton");
  enableWebcamButton.addEventListener("click", enableCam);
} else {
  console.warn("getUserMedia() is not supported by your browser");
}
// Enable the live webcam view and start detection.
async function enableCam(event) {
  if (!gestureRecognizer) {
    alert("Please wait for gestureRecognizer to load");
    return;
  }
  if (webcamRunning === true) {
    webcamRunning = false;
    enableWebcamButton.innerText = "ENABLE PREDICTIONS";
  } else {
    webcamRunning = true;
    enableWebcamButton.innerText = "DISABLE PREDICTIONS";

    // APPEAR_TIME에 따라 콘솔에 로그를 출력합니다.
    if (nodes) {
      nodes.forEach((node) => {
        setTimeout(() => {
          // console.log(`Log at ${node.APPEAR_TIME}`);  // 노드 노출시간 출력 (APPEAR_TIME)

          // circle 클래스를 가진 div를 생성합니다.
          const circleDiv = document.createElement("div");
          circleDiv.className = "circle";

          // webcam의 위치와 크기를 얻습니다.
          const webcamElement = document.getElementById("webcam");

          // div의 위치를 설정합니다. X-COORDINATE와 Y-COORDINATE 값은 0~1 범위라고 가정합니다.
          const radius = 40; // 원의 반지름입니다. 원의 크기에 따라 이 값을 조정해야 합니다.

          circleDiv.style.left = `${
            (1 - node["X-COORDINATE"]) * webcamElement.offsetWidth - radius
          }px`;
          circleDiv.style.top = `${
            node["Y-COORDINATE"] * webcamElement.offsetHeight - radius
          }px`;

          // div를 웹캠의 컨테이너인 webcamWrapper에 추가합니다.
          const webcamWrapper = document.getElementById("webcamWrapper");
          webcamWrapper.appendChild(circleDiv);

          // 3초 후에 생성된 div를 삭제합니다.
          setTimeout(() => {
            webcamWrapper.removeChild(circleDiv);
          }, 3000);
        }, node.APPEAR_TIME * 1000); // APPEAR_TIME은 초 단위로 가정합니다.
      });
    }

    // Usermedia parameters.
    const constraints = {
      video: true,
    };

    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
      video.srcObject = stream;
      video.addEventListener("loadeddata", function () {
        adjustVideoSize(video.videoWidth, video.videoHeight);
        predictWebcam();
      });
    });
  }

  function adjustVideoSize(width, height) {
    const aspectRatio = width / height;
    const webcamWrapper = document.getElementById("webcamWrapper");

    if (window.innerWidth < window.innerHeight) {
      videoWidth = window.innerWidth;
      videoHeight = videoWidth / aspectRatio;
    } else {
      videoHeight = window.innerHeight;
      videoWidth = videoHeight * aspectRatio;
    }

    webcamWrapper.style.width = videoWidth + "px";
    webcamWrapper.style.height = videoHeight + "px";

    canvasElement.width = videoWidth;
    canvasElement.height = videoHeight;
    video.width = videoWidth;
    video.height = videoHeight;
  }

  const onOffButton = document.getElementById("onOffButton");

  onOffButton.addEventListener("click", toggleWebcam);

  function toggleWebcam() {
    const webcamWrapper = document.getElementById("webcamWrapper");
    const webcamElement = document.getElementById("webcam");

    if (webcamElement.style.visibility === "hidden") {
      webcamElement.style.visibility = "visible";
      webcamWrapper.style.backgroundImage = "none"; // 웹캠이 활성화되면 배경 이미지를 숨김
    } else {
      webcamElement.style.visibility = "hidden";
      webcamWrapper.style.backgroundImage = "url('YOASOBI-IDOL.jpg')"; // 웹캠이 비활성화되면 배경 이미지를 보임
      webcamWrapper.style.backgroundSize = "100% 100%"; // 이미지가 웹캠 크기에 맞게 조절됨
      webcamWrapper.style.backgroundRepeat = "no-repeat"; // 이미지가 반복되지 않도록 함
      webcamWrapper.style.backgroundPosition = "center"; // 이미지를 중앙에 위치시킴
    }
  }

  let lastVideoTime = -1;
  let results = undefined;

  async function predictWebcam() {
    const webcamElement = document.getElementById("webcam");
    // Now let's start detecting the stream.
    if (runningMode === "IMAGE") {
      runningMode = "VIDEO";
      await gestureRecognizer.setOptions({ runningMode: "VIDEO", numHands: 2 });
    }
    let nowInMs = Date.now();
    if (video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;
      results = gestureRecognizer.recognizeForVideo(video, nowInMs);
    }
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasElement.style.height = videoHeight + "px";
    webcamElement.style.height = videoHeight + "px";
    canvasElement.style.width = videoWidth + "px";
    webcamElement.style.width = videoWidth + "px";
    if (results.landmarks) {
      canvasCtx.clearRect(0, 0, videoWidth, videoHeight);
      for (const landmarks of results.landmarks) {
        // Draw connectors and landmarks as before.
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

    if (results.gestures.length > 0) {
      gestureOutput.style.display = "block";
      gestureOutput.style.width = videoWidth;
      const firstHand = results.gestures[0][0].categoryName;
      const categoryScore = parseFloat(
        results.gestures[0][0].score * 100
      ).toFixed(2);
      gestureOutput.innerText = `firstHand: ${firstHand}\n Confidence: ${categoryScore} %`;

      handX = results.landmarks[0][9].x;
      handY = results.landmarks[0][9].y;
      if (results.gestures[0][0].categoryName === "Closed_Fist") {
        hideCircle(handX, handY);
      }

      if (results.gestures.length > 1) {
        const secondHand = results.gestures[1][0].categoryName;
        const secondCategoryScore = parseFloat(
          results.gestures[1][0].score * 100
        ).toFixed(2);
        gestureOutput.innerText += `\n secondHand: ${secondHand}\n Confidence: ${secondCategoryScore} %`;

        handX = results.landmarks[1][9].x;
        handY = results.landmarks[1][9].y;
        if (results.gestures[1][0].categoryName === "Closed_Fist") {
          hideCircle(handX, handY);
        }
      }
    } else {
      gestureOutput.style.display = "none";
    }

    if (webcamRunning === true) {
      window.requestAnimationFrame(predictWebcam);
    }
  }
}

function hideCircle(handX, handY) {
  const circleElements = document.querySelectorAll(".circle");
  circleElements.forEach((circleElement) => {
    // 원형 div의 위치를 얻습니다. (0~1 범위로 변환)
    const circleX =
      1 -
      parseFloat(circleElement.style.left.replace("px", "")) /
        document.getElementById("webcam").offsetWidth;
    const circleY =
      parseFloat(circleElement.style.top.replace("px", "")) /
      document.getElementById("webcam").offsetHeight;

    // 손의 위치와 원형 div의 위치 사이의 거리를 계산합니다.
    const distance = Math.sqrt(
      Math.pow(handX - circleX, 2) + Math.pow(handY - circleY, 2)
    );

    console.log(distance);
    // 거리가 특정 임계값 이하이면 원형 div를 삭제합니다.
    const threshold = 0.1; // 필요에 따라 이 값을 조정할 수 있습니다.
    if (distance <= threshold) {
      circleElement.style.display = "none";
    }
  });
}
