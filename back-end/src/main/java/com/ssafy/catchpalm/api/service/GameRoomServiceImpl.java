package com.ssafy.catchpalm.api.service;

import com.ssafy.catchpalm.api.request.GameRoomRegisterPostReq;
import com.ssafy.catchpalm.api.request.UserRegisterPostReq;
import com.ssafy.catchpalm.db.entity.Category;
import com.ssafy.catchpalm.db.entity.GameRoom;
import com.ssafy.catchpalm.db.entity.User;
import com.ssafy.catchpalm.db.repository.GameRoomRepository;
import com.ssafy.catchpalm.db.repository.UserRepository;
import com.ssafy.catchpalm.db.repository.UserRepositorySupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 *	유저 관련 비즈니스 로직 처리를 위한 서비스 구현 정의.
 */
@Service("gameRoomService")
public class GameRoomServiceImpl implements GameRoomService {
	@Autowired
	GameRoomRepository gameRoomRepository;

	@Override
	public GameRoom createRoom(GameRoomRegisterPostReq gameRoomRegisterPostReq) {
		GameRoom gameRoom = new GameRoom();
		User user = new User();
		gameRoom.setCaptain(user);
		user.setUserNumber(gameRoomRegisterPostReq.getUserNumber());// 게임방 언터티에 방장정보 저장.

		gameRoom.setTitle(gameRoomRegisterPostReq.getTitle()); // 입력받은 방제목 저장.
		gameRoom.setCapacity(gameRoomRegisterPostReq.getCapacity()); // 입력받은 정원 수 저장.
		// 입력받은 비밀번호가 있다면 저장.
		if(gameRoomRegisterPostReq.getPassword() != null){
			gameRoom.setPassword(gameRoomRegisterPostReq.getPassword());
		}

		//게임모드이기에 카테고리넘버: 1 = 개인전 | 2 = 팀전
		Category category = new Category();
		gameRoom.setCategory(category);
		category.setCategoryNumber(gameRoomRegisterPostReq.getCategoryNumber());

		//생성 직후 대기방 상태 저장. 0: 대기중, 1: 게임중
		gameRoom.setStatus(0);

		return gameRoomRepository.save(gameRoom);
	}

	@Override
	public void deleteRoom(int roomNumber) {
		Optional<GameRoom> optionalGameRoom = gameRoomRepository.findById(roomNumber);
		if(optionalGameRoom.isPresent()){ // 입력받은 게임룸 번호가 존재하는지 확인.
			//GameRoom gameRoom = optionalGameRoom.get(); // 해당 게임 룸 정보 받기.
			gameRoomRepository.deleteById(roomNumber); // 존재한다면 해당 방 삭제.
		}
	}
}
