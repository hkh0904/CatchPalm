package com.ssafy.catchpalm.websocket.chat.controller;

import com.ssafy.catchpalm.api.service.GameRoomService;
import com.ssafy.catchpalm.db.entity.GameRoomUserInfo;
import com.ssafy.catchpalm.websocket.chat.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@Controller
public class ChatController {
    @Autowired
    private SimpMessagingTemplate template;

    @Autowired
    GameRoomService gameRoomService; // 게임룸 관련 데이터를 가져오기 위해 사용.

    @MessageMapping("/chat.sendMessage")
    @CrossOrigin(origins = "http://localhost:3000")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        System.out.println(chatMessage.getContent() + " " + chatMessage.getSender() + " " + chatMessage.getType()
                + " " + chatMessage.getRoomNumber());

        String roomNumber = String.valueOf(chatMessage.getRoomNumber());

        // 해당 방으로 메시지 브로드캐스팅
        template.convertAndSend("/topic/chat/" + roomNumber, chatMessage);
    }

    @MessageMapping("/chat.addUser")
    @CrossOrigin(origins = "http://localhost:3000")
    public void addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        // 채팅을 위한 유저 닉네임과 게임방 번호, 유저번호를 웹소켓 헤더에 담아둔다. 연결이 끊김을 인지하면 해당 헤더에 저장된 정보를 기반으로 데이터 처리.
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        headerAccessor.getSessionAttributes().put("gameRoom", chatMessage.getRoomNumber());
        headerAccessor.getSessionAttributes().put("userNumber", chatMessage.getUserNumber());

        // 새로 입장한 유저 정보 업데이트
        GameRoomUserInfo userInfo = gameRoomService.addRoomUser(chatMessage.getUserNumber(),chatMessage.getRoomNumber());
        if(userInfo != null){
            // 입장하는 방에 있는 사람들의 정보 가져오기
            List<UserInfo> userInfos = gameRoomService.getRoomUsers(chatMessage.getRoomNumber());
            // 해당 정보 반환 객체에 넣기
            chatMessage.setUserInfo(userInfos);
        }else{
            // 이 전단계에서 한번 거르겠지만 혹시 여기 와서 입장조건이 안되면 어떻게 해야 할지 생각해봐야 겠다..
        }

        // 룸번호 타입 변경
        String roomNumber = String.valueOf(chatMessage.getRoomNumber());
        // 해당 방으로 메시지 브로드캐스팅
        template.convertAndSend("/topic/chat/" + roomNumber, chatMessage);
    }

    @MessageMapping("/ready.click")
    @CrossOrigin(origins = "http://localhost:3000")
    public void clickMessage(@Payload UserReady userReady) {

        // TODO -- 유저번호 레디 신호 받아서 DB에 반영 후 최종 정보 반환
        userReady = gameRoomService.readyStatus(userReady);
        userReady.setType(MessageType.READY);
        // 룸번호 타입 변경
        String roomNumber = String.valueOf(userReady.getRoomNumber());
        // 해당 방으로 메시지 브로드캐스팅
        template.convertAndSend("/topic/chat/" + roomNumber, userReady);
    }

    @MessageMapping("/music.change")
    @CrossOrigin(origins = "http://localhost:3000")
    public void clickMessage(@Payload MusicInfo musicInfo) {

        // TODO -- 반장에 의해 변경된 음악정보 소켓전달.
        // db에 변경사항 종속: 게임방 리스트에서 음악보고 들어올 수 있다.
        gameRoomService.musicChange(musicInfo.getRoomNumber(), musicInfo.getMusicNumber());

        // 메세지 타입 정의.
        musicInfo.setType(MessageType.MUSIC);
        // 룸번호 타입 변경
        String roomNumber = String.valueOf(musicInfo.getRoomNumber());
        // 해당 방으로 메시지 브로드캐스팅
        template.convertAndSend("/topic/chat/" + roomNumber, musicInfo);
    }

    @MessageMapping("/game.start")
    @CrossOrigin(origins = "http://localhost:3000")
    public void gameStart(@Payload MusicInfo musicInfo) {
        System.out.println("gameStart");
        // TODO -- 반장에 의해 게임 시작 및 시작 신호 전달.
        // 시작한 음악번호와 게임방 번호 전달.
        gameRoomService.startGame(musicInfo.getMusicNumber(), musicInfo.getRoomNumber());

        // 메세지 타입 정의.
        musicInfo.setType(MessageType.START);
        musicInfo.setIsStart(1);
        // 룸번호 타입 변경
        String roomNumber = String.valueOf(musicInfo.getRoomNumber());
        // 해당 방으로 메시지 브로드캐스팅
        template.convertAndSend("/topic/chat/" + roomNumber, musicInfo);
    }

    @MessageMapping("/drop.user")
    @CrossOrigin(origins = "http://localhost:3000")
    public void dropUser(@Payload DropInfo dropInfo) {

        // TODO -- 유저번호 레디 신호 받아서 DB에 반영 후 최종 정보 반환
        dropInfo.setType(MessageType.DROP);
        // 룸번호 타입 변경
        String roomNumber = String.valueOf(dropInfo.getRoomNumber());
        // 해당 방으로 메시지 브로드캐스팅
        template.convertAndSend("/topic/chat/" + roomNumber, dropInfo);
    }
}