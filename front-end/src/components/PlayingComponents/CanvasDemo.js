// import React, { useRef, useEffect, useState } from "react";

// export default function CanvasDemo() {
//   const videoRef = useRef(null);
//   const [showBackground, setShowBackground] = useState(false);
//   const [videoHidden, setVideoHidden] = useState(false); // 비디오 hidden 상태를 추적하는 상태 변수


//   const handleStartStreaming = async () => {
//     try { 
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { width: 640, height: 480 },
//       });
//       videoRef.current.srcObject = stream;
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const toggleBackground = () => {
//     setShowBackground(!showBackground);
//     setVideoHidden(!videoHidden); 
//   };

//   useEffect(() => {
//     handleStartStreaming();
//   }, []);

//   return (
//     <div style={{ position: "relative", width: 640, height: 480 }}>
//       <video
//       hidden={videoHidden}
//         ref={videoRef}
//         id="video_in"
//         autoPlay
//         style={{ position: "absolute", transform: "scaleX(-1)" }}
//       />
//       <canvas
//         id="video_out"
//         width={640}
//         height={480}
//         style={{
//           position: "absolute",
//           transform: "scaleX(-1)",
//           backgroundImage: showBackground
//             ? "url('/music/YOASOBI-IDOL.jpg')"
//             : "none",
//           backgroundSize: "cover",
//         }}
//       />
//       <button
//         onClick={toggleBackground}
//         style={{ position: "absolute", bottom: 10 }} // 버튼의 위치를 조정합니다.
//       >
//         {showBackground ? "배경 이미지 숨기기" : "배경 이미지 보이기"}
//       </button>
//     </div>
//   );
// }
