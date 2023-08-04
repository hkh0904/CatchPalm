package com.ssafy.catchpalm.api.service;

import com.ssafy.catchpalm.api.request.GameLogPostReq;
import com.ssafy.catchpalm.db.entity.Music;
import com.ssafy.catchpalm.db.entity.Records;
import com.ssafy.catchpalm.db.entity.User;
import com.ssafy.catchpalm.db.repository.RankRepository;
import com.ssafy.catchpalm.db.repository.RecordsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("gameService")
public class GameServiceImpl implements GameService {

    @Autowired
    RankRepository rankRepository;

    @Autowired
    RecordsRepository recordsRepository;

    @Override
    public void createLog(GameLogPostReq gameInfo){
        Records records = new Records();
        User user = new User();
        Music music = new Music();
        music.setMusicNumber(gameInfo.getMusicNumber());
        records.setMusic(music);
        user.setUserNumber(gameInfo.getUserNumber());
        records.setUser(user);
        records.setScore(gameInfo.getScore());
        recordsRepository.save(records);
    }

}
