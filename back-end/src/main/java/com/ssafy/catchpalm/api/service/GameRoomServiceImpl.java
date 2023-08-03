package com.ssafy.catchpalm.api.service;

import com.ssafy.catchpalm.api.request.GameRoomRegisterPostReq;
import com.ssafy.catchpalm.api.response.GameRoomPostRes;
import com.ssafy.catchpalm.api.response.MusicPostRes;
import com.ssafy.catchpalm.db.entity.*;
import com.ssafy.catchpalm.db.repository.GameRoomRepository;
import com.ssafy.catchpalm.db.repository.GameRoomUserInfoRepository;
import com.ssafy.catchpalm.db.repository.MusicRepository;
import com.ssafy.catchpalm.db.repository.UserRepository;
import com.ssafy.catchpalm.websocket.chat.model.UserInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 *	유저 관련 비즈니스 로직 처리를 위한 서비스 구현 정의.
 */
@Service("gameRoomService")
public class GameRoomServiceImpl implements GameRoomService {
	@Autowired
	GameRoomRepository gameRoomRepository;

	@Autowired
	GameRoomUserInfoRepository gameRoomUserInfoRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	MusicRepository musicRepository;

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

		//게임모드이기에 카테고리넘버: 0 = 개인전 | 1 = 팀전
		Category category = new Category();
		gameRoom.setCategory(category);
		category.setCategoryNumber(gameRoomRegisterPostReq.getCategoryNumber());

		//게임방 디폴트 음악정보 저장: music_number:1
		Music music = new Music();
		gameRoom.setMusic(music);
		music.setMusicNumber(1);

		//생성 직후 대기방 상태 저장. 0: 대기중, 1: 게임중
		gameRoom.setStatus(0);

		// 게임룸 저장
		GameRoom resultGameRoom = gameRoomRepository.save(gameRoom);

		return resultGameRoom;
	}

	@Override
	public void deleteRoom(int roomNumber) {
		GameRoom gameRoom = gameRoomRepository.findById(roomNumber).orElse(null);

		if (gameRoom != null) {
			// GameRoom과 연관된 GameRoomUserInfo들을 찾습니다.
			List<GameRoomUserInfo> gameRoomUserInfos = gameRoom.getUserInfos();
			// GameRoom과 연관된 GameRoomUserInfo들을 삭제합니다.
			gameRoomUserInfoRepository.deleteAll(gameRoomUserInfos);
			// GameRoom을 삭제합니다.
			gameRoomRepository.delete(gameRoom);
		}
	}

	@Override
	public GameRoomUserInfo addRoomUser(Long userNumber, int roomNumber) {
		// 해당 게임룸에 대한 정보 조회: 정원 확인 및 게임방 존재 유무 확인
		GameRoom gameRoom = gameRoomRepository.findById(roomNumber).orElse(null);
		// 게임방이 존재한다면
		if(gameRoom != null){
			int cntUsers = gameRoom.getUserInfos().size();
			if(cntUsers<gameRoom.getCapacity()){
				User user = new User();
				GameRoomUserInfo userInfo = new GameRoomUserInfo();

				userInfo.setUser(user);
				user.setUserNumber(userNumber);

				userInfo.setGameRoom(gameRoom);
				// 들어갈 수 있으면
				return gameRoomUserInfoRepository.save(userInfo);
			}
			//인원이 꽉 찼다면
			else return null;
		}
		// 존재하지 않다면
		else return null;
	}

	@Override
	@Transactional
	public void outRoomUser(Long userNumber, int gameRoomNumber) {
		gameRoomUserInfoRepository.deleteByUserUserNumber(userNumber);// 게임방 유저 나감 처리.
		int cnt = gameRoomUserInfoRepository.countByGameRoomRoomNumber(gameRoomNumber); // 나간 후 인원체크
		if(cnt == 0){ // 아무도 없는 방이 된다면 방 삭제.
			deleteRoom(gameRoomNumber);
		}
		// 만약 방장이 게임방을 나갔고, 게임방 내에 유저가 남아 있을 때.
		// 나간 사람이 방장인지 확인.
		GameRoom gameRoom = gameRoomRepository.findById(gameRoomNumber).orElse(null);// 게임방 정보 불러오는 메서드 실행.
		if(userNumber == gameRoom.getCaptain().getUserNumber()){ // 만약 삭제될 유저번호가 현재 게임방 방장 유저번호와 같다면.: 방장 양도 조건.
			List<GameRoomUserInfo> userInfos = gameRoom.getUserInfos(); // 해당 방의 모든 유저 정보를 불러온다.

			for(GameRoomUserInfo userInfo : userInfos){ // 반복문을 돌려서 게임방 내의 모든 유저정보 조회.
				Long newCaptainNum = userInfo.getUser().getUserNumber(); // 새로이 방장이 될 유저의 번호

				if(newCaptainNum != userNumber){ // 만약 현재 나가려는 방장 유저번호와 새로이 방장이 될 유저의 번호가 다르다면
					User newCaptain = userRepository.findById(newCaptainNum).orElse(null); // 업데이트할 정보 정의.

					if (newCaptain != null) { // 실제 존재하는 유저이다면
						gameRoom.setCaptain(newCaptain);  // 새로운 방장 정보에 업데이트.
						gameRoomRepository.save(gameRoom); // 업데이트 실행.
						break;
					}

				}
			}
		}
	}

	@Override
	public List<GameRoomPostRes> gameRoomList() {
		// 모든 GameRoom 엔티티 조회
		List<GameRoom> gameRooms = gameRoomRepository.findAll();
		List<GameRoomPostRes> gameRoomPostRes = new ArrayList<>();

		for(GameRoom gameRoom : gameRooms){
			gameRoomPostRes.add(GameRoomPostRes.of(gameRoom,null));
		}

		return gameRoomPostRes;
	}

	@Override
	public void startGame(int musicNumber, int gameRoomNumber) {
		// 엔티티 조회: 게임방 정보 가져오기.( 유무도 확인)
		Optional<GameRoom> optionalGameRoom = gameRoomRepository.findById(gameRoomNumber);
		Music music = new Music();
		if(optionalGameRoom.isPresent()){
			GameRoom gameRoom = optionalGameRoom.get();
			gameRoom.setStatus(1);
			gameRoom.setMusic(music);
			music.setMusicNumber(musicNumber);

			gameRoomRepository.save(gameRoom);
		}
	}

	@Override
	public GameRoomPostRes getRoomInfo(int roomNumber) {
		// 해당 게임룸에 대한 정보 조회: 정원 확인 및 게임방 존재 유무 확인
		GameRoom gameRoom = gameRoomRepository.findById(roomNumber).orElse(null);
		// 존재하는 게임방일 때.
		if (gameRoom != null) {
			// 모든 GameRoom 엔티티 조회
			List<Music> musics = musicRepository.findAll();
			List<MusicPostRes> resMusics = new ArrayList<>();
			for(Music music : musics){
				resMusics.add(MusicPostRes.of(music));
			}
			GameRoomPostRes resultGameRoom = GameRoomPostRes.of(gameRoom, resMusics);
			return resultGameRoom;
		}
		return null;
	}

	@Override
	public List<UserInfo> getRoomUsers(int roomNumber) {
		List<GameRoomUserInfo> userInfos = gameRoomUserInfoRepository.findByGameRoomRoomNumber(roomNumber);

		List<UserInfo> resultUserInfos = new ArrayList<>();

		for(GameRoomUserInfo userInfo : userInfos){
			UserInfo resultUserInfo = new UserInfo();
			resultUserInfo.setNickname(userInfo.getUser().getNickname());
			resultUserInfo.setProfileImg(userInfo.getUser().getProfileImg());
			resultUserInfo.setUserNumber(userInfo.getUser().getUserNumber());

			resultUserInfos.add(resultUserInfo);
		}
		return resultUserInfos;
//		// 해당 게임룸에 대한 정보 조회: 정원 확인 및 게임방 존재 유무 확인
//		GameRoom gameRoom = gameRoomRepository.findById(roomNumber).orElse(null);
//
//		// 존재하는 게임방일 때.
//		if (gameRoom != null) {
//			List<GameRoomUserInfo> gameRoomUserInfos = gameRoom.getUserInfos();
//
//			for(GameRoomUserInfo userInfo : gameRoomUserInfos){
//				System.out.println(userInfo.getUserInfoNumber());
//			}
//			System.out.println("ishear");
//		}
	}
}
