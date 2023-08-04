package com.ssafy.catchpalm.websocket.chat.model;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {

    private MessageType type;
    private String content;
    private String sender;
    private int roomNumber;
    private Long userNumber;
    private String nickname;
    private Long captain;
    private List<UserInfo> userInfo;
}