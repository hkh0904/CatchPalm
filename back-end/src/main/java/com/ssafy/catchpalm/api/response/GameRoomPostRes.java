package com.ssafy.catchpalm.api.response;

import com.ssafy.catchpalm.db.entity.Category;
import com.ssafy.catchpalm.db.entity.GameRoom;
import com.ssafy.catchpalm.db.entity.GameRoomUserInfo;
import com.ssafy.catchpalm.db.entity.User;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ApiModel("GameRoomResponse")
public class GameRoomPostRes {
    @ApiModelProperty(name="GameRoom Number")
    int roomNumber;

    @ApiModelProperty(name="GameRoom captainNickName")
    String nickName;

    @ApiModelProperty(name="GameRoom Type")
    String typeName;

    @ApiModelProperty(name="GameRoom capacity")
    int capacity; // 게임방 총 정원

    @ApiModelProperty(name="GameRoom cntUser")
    int cntUser; // 게임방 현재정원

    @ApiModelProperty(name="GameRoom password")
    String password; // 게임방 비밀번호, NULL 여부로 비번 유무 확인.

    @ApiModelProperty(name="GameRoom title")
    String title; // 게임방 제목

    @ApiModelProperty(name="GameRoom status")
    int status; // 게임방 상태 : 0 = wait, 1 = gaming

    public static GameRoomPostRes of(GameRoom gameRoom, int cntUser) {
        GameRoomPostRes res = new GameRoomPostRes();
        res.setRoomNumber(gameRoom.getRoomNumber());
        res.setCapacity(gameRoom.getCapacity());
        res.setPassword(gameRoom.getPassword());
        res.setStatus(gameRoom.getStatus());
        res.setCntUser(gameRoom.getUserInfos().size());
        res.setNickName(gameRoom.getCaptain().getNickName());
        res.setTitle(gameRoom.getTitle());
        res.setTypeName(gameRoom.getCategory().getName());
        return res;
    }
}
