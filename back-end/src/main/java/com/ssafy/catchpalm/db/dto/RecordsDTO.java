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
    private int roomNumber;

    public RecordsDTO(long recordsNumber, int score, int roomNumber, UserDTO userDTO, MusicDTO musicDTO) {
        this.recordsNumber = recordsNumber;
        this.score = score;
        this.roomNumber = roomNumber;
        this.userDTO = userDTO;
        this.musicDTO = musicDTO;
    }

    public static RecordsDTO fromEntity(Records records){
        UserDTO userDto = UserDTO.fromEntity(records.getUser());
        MusicDTO musicDTO = MusicDTO.fromEntity(records.getMusic());
        return new RecordsDTO(records.getRecordsNumber(), records.getScore(), records.getRoomNumber(),userDto,musicDTO);
    }

}
