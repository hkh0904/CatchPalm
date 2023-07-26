package com.ssafy.catchpalm.api.controller;

import com.ssafy.catchpalm.api.request.GameRoomRegisterPostReq;
import com.ssafy.catchpalm.api.request.UserRegisterPostReq;
import com.ssafy.catchpalm.api.response.GameRoomPostRes;
import com.ssafy.catchpalm.api.response.UserRes;
import com.ssafy.catchpalm.api.service.GameRoomService;
import com.ssafy.catchpalm.api.service.UserService;
import com.ssafy.catchpalm.common.auth.SsafyUserDetails;
import com.ssafy.catchpalm.common.model.response.BaseResponseBody;
import com.ssafy.catchpalm.db.entity.GameRoom;
import com.ssafy.catchpalm.db.entity.GameRoomUserInfo;
import com.ssafy.catchpalm.db.entity.User;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;
import java.util.Map;

/**
 * 게임방 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "게임룸 API", tags = {"GameRoom"})
@RestController
@RequestMapping("/api/v1/gameRooms")
public class GameRoomController {

	@Autowired
	GameRoomService gameRoomService;

	@PostMapping("/create")
	@ApiOperation(value = "게임방 생성", notes = "<strong>방장유저번호, 방제, 정원, 비밀번호(선택), 카테고리</strong>를 통해 방 생성.")
    @ApiResponses({
        @ApiResponse(code = 200, message = "성공"),
        @ApiResponse(code = 401, message = "인증 실패"),
        @ApiResponse(code = 404, message = "사용자 없음"),
        @ApiResponse(code = 500, message = "서버 오류")
    })
	public ResponseEntity<GameRoom> createRoom(
			@RequestBody @ApiParam(value="방 정보", required = true) GameRoomRegisterPostReq gameRoomInfo) {

		GameRoom gameRoom = gameRoomService.createRoom(gameRoomInfo);
		gameRoomService.addRoomUser(gameRoomInfo.getUserNumber(), gameRoom.getRoomNumber());
		return ResponseEntity.status(200).body(gameRoom);
	}
//		return ResponseEntity.status(200).body(GameRoomPostRes.of(gameRoom,1));

	@DeleteMapping("/delete/{roomNumber}")
	@ApiOperation(value = "게임방 삭제", notes = "<strong>게임방 번호</strong>를 통해 방 삭제. ")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> deleteRoom(
			@ApiParam(value="방 정보", required = true)@PathVariable("roomNumber") int roomNumber) {

		gameRoomService.deleteRoom(roomNumber);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}

	@PostMapping("/addUser")
	@ApiOperation(value = "게임방유저 추가", notes = "<strong>유저넘버</strong>를 통해 게임방유저테이블에 추가. ")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> addUser(
			@ApiParam(value="'userNumber' : 번호, 'roomNumber' : 번호", required = true)@RequestBody Map<String, Integer> map) {
		Long userNumber = Long.valueOf(map.get("userNumber"));
		int roomNumber = map.get("roomNumber");
		gameRoomService.addRoomUser(userNumber, roomNumber);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}
}
