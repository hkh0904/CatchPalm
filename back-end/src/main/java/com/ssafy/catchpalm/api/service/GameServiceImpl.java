package com.ssafy.catchpalm.api.service;

import com.ssafy.catchpalm.api.request.GameLogPostReq;
import com.ssafy.catchpalm.db.entity.Music;
import com.ssafy.catchpalm.db.entity.Rank;
import com.ssafy.catchpalm.db.entity.Records;
import com.ssafy.catchpalm.db.entity.User;
import com.ssafy.catchpalm.db.repository.RankRepository;
import com.ssafy.catchpalm.db.repository.RecordsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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

    @Override
    public void createRank(GameLogPostReq gameInfo){
        Optional<Rank> optionalRank = rankRepository.findByRankUserUserNumberAndMusicMusicNumber(gameInfo.getUserNumber(), gameInfo.getMusicNumber());
        Rank rank = null;
        if(!optionalRank.isPresent()){
            rank = new Rank();
            User user = new User();
            Music music = new Music();
            music.setMusicNumber(gameInfo.getMusicNumber());
            rank.setMusic(music);
            user.setUserNumber(gameInfo.getUserNumber());
            rank.setRankUser(user);
            rank.setScore(gameInfo.getScore());
        }else{
            rank = optionalRank.get();
            if(gameInfo.getScore()>rank.getScore()) {
                rank.setScore(gameInfo.getScore());
                rank.setPlayDateTime(LocalDateTime.now());
            }
        }
        rankRepository.save(rank);
    }

    @Override
    public List<Rank> getRanksByMusicNumber(int musicNumber) {
        // 랭크 리스트가 비어 있을 경우, 이 코드는 빈 Rank 리스트를 반환합니다.
        return rankRepository.findByMusicMusicNumber(musicNumber);
    }



    @Override
    public Rank getRankByUserNumberAndMusicNumber(long userNumber, int musicNumber){
        Optional<Rank> optionalRank = rankRepository.findByRankUserUserNumberAndMusicMusicNumber(userNumber, musicNumber);
        if(!optionalRank.isPresent()){
            return null;
        }
        Rank rank = optionalRank.get();
        return rank;

    }


}
