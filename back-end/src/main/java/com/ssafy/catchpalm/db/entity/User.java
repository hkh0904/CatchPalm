package com.ssafy.catchpalm.db.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
import org.checkerframework.checker.units.qual.C;

import javax.persistence.*;
import java.sql.Blob;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 유저 모델 정의.
 */
@Entity
@Getter
@Setter
public class User{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_number")
    private Long userNumber = null;

    @Column(unique = true, nullable = false)
    private String userId;

    @JsonIgnore
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String email;

    @JsonIgnore
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Column(unique = true, nullable = false)
    private String nickName;

    @Lob
    @Column(name = "profile_img", columnDefinition = "BLOB")
    private Blob profileImg;

    @Lob
    @Column(name = "profile_music", columnDefinition = "BLOB")
    private Blob profileMusic;

    private int point = 0;

    private double synk = 0.0;

    @Column(name = "refresh_token")
    private String refreshToken;

    // 0:오프라인, 1:온라인, 2:게임중
    private int status = 0;

    @Column(name = "join_date", nullable = false, updatable = false)
    private LocalDateTime joinDate;

    //민우추가
    @OneToMany(mappedBy = "userLike")
    private List<MusicLike> likeList = new ArrayList<>(); // 양방향 매핑: 좋아요 정보 리스트
    @OneToOne(mappedBy = "rankUser")
    private Rank rank;

    public User() {
        this.joinDate = LocalDateTime.now(); // 가입일을 현재 시간으로 자동 설정
    }

}
