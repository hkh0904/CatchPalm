package com.ssafy.catchpalm.websocket.chat.model;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserReady {
   private Long userNumber;
   private int isReady; // 0: 레디x | 1: 레디o
}
