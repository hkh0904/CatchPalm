import React, { useEffect, useState } from "react";
import { GestureRecognizer, FilesetResolver } from "@mediapipe/tasks-vision";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import { drawLandmarks, drawConnectors } from "@mediapipe/drawing_utils";
import { Button } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import axios from "axios";

//********************************************************** */
let gestureRecognizer = undefined;
let category1Name = undefined;
let category2Name = undefined;
let video = undefined;
let canvasElement = undefined;
let canvasCtx = undefined;
let category1Score = undefined;
let category2Score = undefined;
let vision = undefined;

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
  const [category1, setCategory1] = useState("category1Name");
  const [category2, setCategory2] = useState("category2Name");
  const [doPredictionsBtn, setBtn] = useState("Start");
  const [nodes, setNodes] = useState([]);

  function handleDoPredictions() {
    preRun();
    predictWebcam();
    setBtn("Stop");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/music/YOASOBI-IDOL.json");
        setNodes(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching the JSON data:", error);
      }
    };
    fetchData();
    createGestureRecognizer();
    console.log("ReRender : createGestureRecognizer Reached");
  }, []);

  function preRun() {
    video = document.getElementById("video_in");
    canvasElement = document.getElementById("video_out");
    canvasCtx = canvasElement.getContext("2d");
  }

  async function predictWebcam() {
    // Now let's start detecting the stream.
    let nowInMs = Date.now();
    let results = gestureRecognizer.recognizeForVideo(video, nowInMs);

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(video, 0, 0);

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
    if (results.gestures.length > 0) {
      category1Name = results.gestures[0][0].categoryName;
      category1Score = parseFloat(results.gestures[0][0].score * 100).toFixed(
        2
      );
      // console.log(`1st_Hand x: ${results.landmarks[0][9].x.toFixed(5)}, y: ${results.landmarks[0][9].y.toFixed(5)}`);
      setCategory1(category1Name);

      if (results.gestures.length > 1) {
        category2Name = results.gestures[1][0].categoryName;
        category2Score = parseFloat(results.gestures[1][0].score * 100).toFixed(
          2
        );
        // console.log(`2nd_Hand x: ${results.landmarks[1][9].x.toFixed(5)}, y: ${results.landmarks[1][9].y.toFixed(5)}`);
        setCategory2(category2Name);
      }
    }
    window.requestAnimationFrame(predictWebcam);
  }

  return (
    <Box width={672}>
      <Card>
        <CardContent>
          <Button
            variant="contained"
            sx={{ display: "inline-flex" }}
            onClick={() => {
              handleDoPredictions();
            }}
          >
            {doPredictionsBtn}
          </Button>

          {
            <div>
              {" "}
              Thats : {category1} : {category1Score}%{" "}
            </div>
          }
          {
            <div>
              {" "}
              Thats : {category2} : {category2Score}%{" "}
            </div>
          }
        </CardContent>
      </Card>
    </Box>
  );
}
