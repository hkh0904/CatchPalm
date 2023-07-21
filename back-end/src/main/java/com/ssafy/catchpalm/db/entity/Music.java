package com.ssafy.catchpalm.db.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
public class Music {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "music_number")
    private int musicNumber; // 음악 고유번호(개인키)

    @Column(name = "music_name")
    private String musicName; // 음악 이름

    @Column(name = "running_time")
    private LocalTime runningTime; // 음악 재생시간

    private String singer; // 가수

    private String composer; // 작곡가

    @Column(name = "release_date")
    private LocalDate releaseDate; //발매일

    private String level; // 난이도

    @Column(name = "play_cnt")
    private int playCnt; // 플레이 횟수

    @Column(name = "mp4_address")
    private String mp4Address; // 음악파일 저장위치

    @Column(name = "background_address")
    private String backgroundAddress; // 배경파일 저장위치
}
