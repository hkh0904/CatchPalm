package com.ssafy.catchpalm.websocket.chat.controller;

import com.ssafy.catchpalm.websocket.chat.model.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Controller
public class ChatController {
    @Autowired
    private SimpMessagingTemplate template;
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

        String roomNumber = String.valueOf(chatMessage.getRoomNumber());
        // 해당 방으로 메시지 브로드캐스팅
        template.convertAndSend("/topic/chat/" + roomNumber, chatMessage);
    }
}