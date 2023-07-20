package com.ssafy.catchpalm.db.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity(name = "GAME_ROOM_USERINFO")
@Getter
@Setter
public class GameRoomUserInfo {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "userinfo_number")
    private int userInfoNumber;

    @ManyToOne// 단방향 매핑
    @JoinColumn(name = "user_number", nullable = false)
    private User user;

    @ManyToOne// 단방향 매핑
    @JoinColumn(name = "room_number", nullable = false)
    private GameRoom gameRoom;
    private int team;
}
