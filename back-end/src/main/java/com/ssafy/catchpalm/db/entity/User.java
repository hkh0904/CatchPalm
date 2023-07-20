package com.ssafy.catchpalm.db.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Blob;
import java.time.LocalDateTime;

/**
 * 유저 모델 정의.
 */
@Entity
@Getter
@Setter
public class User{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long user_number = null;

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

    // 0:오프라인, 1:온라인, 2:게임중
    private int status = 0;

    @Column(name = "join_date", nullable = false, updatable = false)
    private LocalDateTime joinDate;

    public User() {
        this.joinDate = LocalDateTime.now(); // 가입일을 현재 시간으로 자동 설정
    }

}
