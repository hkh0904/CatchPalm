package com.ssafy.catchpalm.db.entity;

import jdk.Exported;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity(name = "GAME_ROOM")
@Getter
@Setter
public class GameRoom {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "room_number")
    private int roomNumber;



    @OneToMany(mappedBy = "gameRoom")// 양방향 매핑 : 게임방 유저 리스트.
    private List<GameRoomUserInfo> userInfos = new ArrayList<>();

    @ManyToOne // 단방향 매핑 : 카테고리 정보
    @JoinColumn(name = "category_number", nullable = false)
    private Category category;

    @Column(nullable = false)
    private int capacity; // 게임방 정원
    @Column(nullable = false)
    private String password; // 게임방 비밀번호
    @Column(nullable = false)
    private String title; // 게임방 제목
    @Column(nullable = false)
    private int status; // 게임방 상태 : 0 = wait, 1 = gaming

    //연관관계 편의 메서드 : 방 유저 추가
    public void addUser(GameRoomUserInfo userInfo){
        userInfos.add(userInfo);
        userInfo.setGameRoom(this);
    }
}
