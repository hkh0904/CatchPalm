package com.ssafy.catchpalm.websocket.chat.controller;

import com.ssafy.catchpalm.api.service.GameRoomService;
import com.ssafy.catchpalm.websocket.chat.model.ChatMessage;
import com.ssafy.catchpalm.websocket.chat.model.UserInfo;
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
        // Add username in web socket session
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        headerAccessor.getSessionAttributes().put("gameRoom", chatMessage.getRoomNumber());
        headerAccessor.getSessionAttributes().put("userNumber", chatMessage.getUserNumber());
        // 입장하는 방에 있는 사람들의 정보 가져오기
        List<UserInfo> userInfos = gameRoomService.getRoomUsers(chatMessage.getRoomNumber());
        // 해당 정보 반환 객체에 넣기
        chatMessage.setUserInfo(userInfos);
        // 룸번호 타입 변경
        String roomNumber = String.valueOf(chatMessage.getRoomNumber());
        // 해당 방으로 메시지 브로드캐스팅
        template.convertAndSend("/topic/chat/" + roomNumber, chatMessage);
    }
}