package com.ssafy.catchpalm.config;

import com.ssafy.catchpalm.api.service.GameRoomService;
import com.ssafy.catchpalm.websocket.chat.model.ChatMessage;
import com.ssafy.catchpalm.websocket.chat.model.MessageType;
import com.ssafy.catchpalm.websocket.chat.model.UserInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messagingTemplate;

    @Autowired
    GameRoomService gameRoomService; // 게임룸 관련 데이터를 가져오기 위해 사용.

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        int roomNumber = (int) headerAccessor.getSessionAttributes().get("gameRoom");
        Long userNumber = (Long) headerAccessor.getSessionAttributes().get("userNumber");

        if (username != null) {
            log.info("user disconnected: {}", username);
            ChatMessage chatMessage = ChatMessage.builder()
                    .type(MessageType.LEAVE)
                    .sender(username)
                    .build();
            // 연결이 끊긴(게임방을 나간) 후 게임방 정보 업데이트
            try {
                Long captain = gameRoomService.outRoomUser(userNumber, roomNumber); // 나간 유저가 방장이였다면 새로운 반장 리턴.
                if (captain != null) chatMessage.setCaptain(captain); // 반환값이 있었다면 방장 변경.
            }catch (Exception e){
                e.getMessage();
                System.out.println(e);
            }

            //  방에 있는 사람들의 정보 가져오기
            List<UserInfo> userInfos = gameRoomService.getRoomUsers(chatMessage.getRoomNumber());
            // 해당 정보 반환 객체에 넣기
            chatMessage.setUserInfo(userInfos);
            messagingTemplate.convertAndSend("/topic/chat/"+roomNumber, chatMessage);
        }
    }

}