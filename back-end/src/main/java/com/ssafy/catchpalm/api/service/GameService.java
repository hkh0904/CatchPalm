package com.ssafy.catchpalm.api.service;

import com.ssafy.catchpalm.api.request.GameLogPostReq;

public interface GameService {
    void createLog(GameLogPostReq gameInfo);
}
