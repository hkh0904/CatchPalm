# CatchPalm - 손으로 리듬을 잡아라!

## 소개 및 시연 영상

## 개요
VR게임의 시대! 그런데 VR기기 너무 비싸고 불편하지 않나요? 웹캠만 있으면 간편하게 즐길 수 있는 유사 VR 리듬게임 CatchPalm으로 즐겨보세요

## Why?
비디오를 이용한 게임을 구상 중 BeatSaber에서 영감을 받아 손모양을 인식해서 즐길 수 있는 리듬게임을 구상했습니다.

## 주요 서비스 화면

### 게임 실행 화면

### 대기방

### 결과창

### 랭킹 창

#### 더 자세한 정보는 https://lab.ssafy.com/s09-webmobile1-sub2/S09P12C206/-/blob/master/scenario-details.md 에서!

---

## 주요 기능
---
서비스 설명 : 아무나 VR기기 없이 즐길 수 있는 유사 VR리듬게임

주요 기능 :
- MediaPipe를 통한 실시간 손모양 인식을 통한 리듬게임
- WebRTC를 활용한 친구들 끼리의 동시 화상 진행
- 랭킹 시스템을 통한 사용자들 끼리의 승부욕 증진
- Adding...

## 개발 환경
### BackEnd
- Intellij
- Spring Boot 2.4.5
- Spring Boot JPA
- Spring Security
- Java 17
- AWS EC2
- Mysql
- WebSocket
- OAuth
- Adding...
### FrontEnd
- Visual Studio Code
- React
- Material-UI
- MediaPipe
- Adding...
### WebRTC
- OpenVidu 2.19.0
### CI/CD
- AWS EC2
- Docker
- NginX
- GitLab

## 서비스 아키텍처

## 기술 상세
- MediaPipe
  - 현재 사용자의 웹캠 화면에 나오는 손 정보를 분석하여 화면에 띄운 후, 손을 펼쳤을 때 중앙이라고 할 수 있는 중지손가락 관절이 시작되는 부분의 손의 좌표를 인식하여 화면에 나오는 원과 타이밍이 맞게 손 모양을 입력했을 시에, 타이밍에 따라 점수를 차등부여 시켰습니다. 
- WebSocket
  - 게임 대기방을 WebSocket을 활용하여 통신이 되도록 하여 사용자들 끼리의 채팅을 구현하였습니다. 방의 최대 인원은 4명으로 세팅 하였으며 방장을 제외한 모든 사람들이 Ready버튼을 누르면 모두가 해당 사용자가 Ready를 했음을 인식 할 수 있고, 모든 사용자가 Ready상태가 되어야 게임이 시작될 수 있도록 구성했습니다. 그 후 게임 시작이 된다면 WebSocket은 종료되고 WebRTC로 넘어가게 됩니다.
- WebRTC (Openvidu)
  - WebSocket환경에서 게임 시작을 한 뒤 WebRTC환경으로 들어오게 됩니다. 하지만 게임 중에 사용자들이 얼굴이 서로에게 보이는 것은 불쾌할 수 있다고 생각하여 원하는 사람들(EX. 친구들과 게임을 하는 사람들)은 우측에 버튼을 눌러 WebRTC화상 환경에 접속할 수 있도록 구성했습니다.
- 배포
  - Docker, NginX를 이용하여 Git에서 코드를 가져와 Build후 배포하는 수동배포를 구현하였습니다. BackEnd와 FrontEnd를 Docker를 활용하여 배포하였습니다.

## 협업 툴
- Git
- Jira
- Mattermost
- Discord

## 요구사항 정의서

## 코딩 컨벤션

## Git 컨벤션

## ER Diagram

## EC2 포트 정리
|Port|내용|
|------|---|
|443|HTTPS|
|80|HTTP(HTTPS 로 Redirect)|
|4443|Openvidu|
|3306|MySQL|
|8080|Spring Boot Docker Container|
|3000|React Docker Container|


## 팀원 역할
1. 백엔드1(팀장) - CI/CD 총괄 및 코드 종합, 디버깅
2. 백엔드2 - 
3. 백엔드3 - 
4. 프론트엔드1 - MediaPipe를 활용한 리듬 게임 개발 총괄
5. 프론트엔드2 - 
6. 프론트엔드3 - 
