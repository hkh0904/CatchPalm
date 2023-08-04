package com.ssafy.catchpalm.websocket.chat.model;

import lombok.*;

import java.sql.Blob;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserInfo {
    private Long userNumber;
    private Blob profileImg;
    private String nickname;
}
