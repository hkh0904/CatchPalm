package com.ssafy.catchpalm.db.dto;

import com.ssafy.catchpalm.db.entity.Rank;
import com.ssafy.catchpalm.db.entity.Records;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class RecordsDTO {
    private long recordsNumber;
    private int score;
    private UserDTO userDTO;
    private MusicDTO musicDTO;
    private GameRoomDTO gameRoomDTO;

    public RecordsDTO(long recordsNumber, int score, GameRoomDTO gameRoomDTO, UserDTO userDTO, MusicDTO musicDTO) {
        this.recordsNumber = recordsNumber;
        this.score = score;
        this.gameRoomDTO = gameRoomDTO;
        this.userDTO = userDTO;
        this.musicDTO = musicDTO;
    }

    public static RecordsDTO fromEntity(Records records){
        UserDTO userDto = UserDTO.fromEntity(records.getUser());
        MusicDTO musicDTO = MusicDTO.fromEntity(records.getMusic());
        GameRoomDTO gameRoomDTO = GameRoomDTO.fromEntity(records.getGameRoom());
        return new RecordsDTO(records.getRecordsNumber(), records.getScore(), gameRoomDTO,userDto,musicDTO);
    }

}
