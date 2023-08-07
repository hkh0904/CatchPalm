package com.ssafy.catchpalm.api.controller;

import com.ssafy.catchpalm.api.request.*;
import com.ssafy.catchpalm.api.response.GameRoomPostRes;
import com.ssafy.catchpalm.api.response.RankListPostRes;
import com.ssafy.catchpalm.api.response.UserRes;
import com.ssafy.catchpalm.api.service.GameRoomService;
import com.ssafy.catchpalm.api.service.GameService;
import com.ssafy.catchpalm.api.service.UserService;
import com.ssafy.catchpalm.common.auth.SsafyUserDetails;
import com.ssafy.catchpalm.common.model.response.BaseResponseBody;
import com.ssafy.catchpalm.db.entity.GameRoom;
import com.ssafy.catchpalm.db.entity.GameRoomUserInfo;
import com.ssafy.catchpalm.db.entity.Rank;
import com.ssafy.catchpalm.db.entity.User;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 게임 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "게임 API", tags = {"Game"})
@RestController
@RequestMapping("/api/v1/game")
public class GameController {

    @Autowired
    GameService gameService;

    @PostMapping("/log")
    @ApiOperation(value = "로그 기록", notes = "<strong>게임 기록을 넘겨주면</strong>로그를 기록한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<BaseResponseBody> createLog(
            @RequestBody @ApiParam(value="방 정보", required = true) GameLogPostReq gameInfo) {

        // 로그 기록
        gameService.createLog(gameInfo);
        // 랭킹 업데이트
        gameService.createRank(gameInfo);

        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @GetMapping("/rank")
    @ApiOperation(value = "곡에 대한 랭킹 기록", notes = "<strong>뮤직 넘버와 유저 넘버를 넘겨주면</strong>곡에 대한 랭킹을 제공한다. (유저 넘버를 안보내면 전체 랭킹을 보낸다")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<RankListPostRes> getRank(@RequestParam("musicNumber") int musicNumber
            , @RequestParam(value = "userNumber", required = false) Long userNumber) {
        List<Rank> ranks = new ArrayList<>();
        if(userNumber==null){
            ranks = gameService.getRanksByMusicNumber(musicNumber);
        }else{
            if(gameService.getRankByUserNumberAndMusicNumber(userNumber,musicNumber)!=null) {
                ranks.add(gameService.getRankByUserNumberAndMusicNumber(userNumber, musicNumber));
            }
        }

        return ResponseEntity.status(200).body(RankListPostRes.of(200, "Success",ranks));
    }
}