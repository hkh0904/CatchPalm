package com.ssafy.catchpalm.api.service;

import com.ssafy.catchpalm.api.request.GameLogPostReq;
import com.ssafy.catchpalm.db.entity.Rank;

import java.util.List;

public interface GameService {
    void createLog(GameLogPostReq gameInfo);

    void createRank(GameLogPostReq gameinfo);

    List<Rank> getRanksByMusicNumber(int musicNumber);

    Rank getRankByUserNumberAndMusicNumber(long userNumber, int musicNumber);
}
