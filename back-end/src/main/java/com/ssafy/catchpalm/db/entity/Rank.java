package com.ssafy.catchpalm.db.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity(name = "RANKING")
@Getter
@Setter
public class Rank {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "rank_number")
    private int rankNumber;

    @OneToOne
    @JoinColumn(name = "user_number")
    private User rankUser; // 랭거 정보 : 단방향 매핑

    @ManyToOne
    @JoinColumn(name = "music_number")
    private Music music; // 랭킹등록된 해당 음악 정보 : 단방향 매핑

    private int score; // 해당 점수

    @Column(name = "play_datetime")
    private LocalDateTime playDateTime; // 플레이 시작일
}
