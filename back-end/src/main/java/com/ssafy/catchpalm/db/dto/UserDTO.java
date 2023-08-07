package com.ssafy.catchpalm.db.dto;

import com.ssafy.catchpalm.db.entity.User;
import lombok.Getter;
import lombok.Setter;

import java.sql.Blob;

@Getter
@Setter
public class UserDTO {
    private Long userNumber;
    private String userId;
    private String nickname;
    private Blob profileImg;

    public UserDTO(Long userNumber, String userId, String nickname,Blob profileImg) {
        this.userNumber = userNumber;
        this.userId = userId;
        this.nickname = nickname;
        this.profileImg = profileImg;
    }

    public static UserDTO fromEntity(User user) {
        return new UserDTO(user.getUserNumber(), user.getUserId(), user.getNickname(), user.getProfileImg());
    }
}