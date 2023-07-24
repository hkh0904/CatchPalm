package com.ssafy.catchpalm.db.entity;

import lombok.Getter;
import lombok.Setter;
import org.checkerframework.checker.units.qual.C;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Records {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "records_number")
    private Long recordsNumber;

    @ManyToOne
    @JoinColumn(name = "music_number")
    private Music music;

    @ManyToOne
    @JoinColumn(name = "user_number")
    private User user;

    private int score;

    @Column(name = "play_datetime")
    private LocalDateTime platDateTime;
}
