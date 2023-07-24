package com.ssafy.catchpalm.api.service;

import com.ssafy.catchpalm.api.request.GameRoomRegisterPostReq;
import com.ssafy.catchpalm.db.entity.GameRoom;

/**
 *	유저 관련 비즈니스 로직 처리를 위한 서비스 인터페이스 정의.
 */
public interface GameRoomService {
	GameRoom createRoom(GameRoomRegisterPostReq gameRoomRegisterPostReq);
	void deleteRoom(int roomNumber);
}
