package com.ssafy.catchpalm.db.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Rank {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "rank_number")
    private int rankNumber;

    @OneToOne
    @JoinColumn(name = "user_number")
    private User user;

    @ManyToOne
    @JoinColumn(name = "music_number")
    private Music music;

    private int score;

    @Column(name = "play_datetime")
    private LocalDateTime playDateTime;
}
