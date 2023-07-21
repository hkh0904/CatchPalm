package com.ssafy.catchpalm.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.catchpalm.api.request.UserLoginPostReq;
import com.ssafy.catchpalm.api.response.UserLoginPostRes;
import com.ssafy.catchpalm.api.service.UserService;
import com.ssafy.catchpalm.common.model.response.BaseResponseBody;
import com.ssafy.catchpalm.common.util.JwtTokenUtil;
import com.ssafy.catchpalm.db.entity.User;
import com.ssafy.catchpalm.db.repository.UserRepositorySupport;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponses;
import io.swagger.annotations.ApiResponse;

/**
 * 인증 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "인증 API", tags = {"Auth."})
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
	@Autowired
	UserService userService;
	
	@Autowired
	PasswordEncoder passwordEncoder;
	
	@PostMapping("/login")
	@ApiOperation(value = "로그인", notes = "<strong>아이디와 패스워드</strong>를 통해 로그인 한다.") 
    @ApiResponses({
        @ApiResponse(code = 200, message = "성공", response = UserLoginPostRes.class),
        @ApiResponse(code = 401, message = "인증 실패", response = BaseResponseBody.class),
        @ApiResponse(code = 404, message = "사용자 없음", response = BaseResponseBody.class),
        @ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
    })
	public ResponseEntity<UserLoginPostRes> login(@RequestBody @ApiParam(value="로그인 정보", required = true) UserLoginPostReq loginInfo) {
		String userId = loginInfo.getId();
		String password = loginInfo.getPassword();
		String refreshToken = JwtTokenUtil.getRefreshToken(userId);
		
		User user = userService.getUserByUserId(userId);
		userService.updateRefreshToken(userId, refreshToken);
		// 로그인 요청한 유저로부터 입력된 패스워드 와 디비에 저장된 유저의 암호화된 패스워드가 같은지 확인.(유효한 패스워드인지 여부 확인)
		if(passwordEncoder.matches(password, user.getPassword())) {
			// 유효한 패스워드가 맞는 경우, 로그인 성공으로 응답.(액세스 토큰을 포함하여 응답값 전달)
			return ResponseEntity.ok(UserLoginPostRes.of(200, "Success", JwtTokenUtil.getToken(userId)));
		}
		// 유효하지 않는 패스워드인 경우, 로그인 실패로 응답.
		return ResponseEntity.status(401).body(UserLoginPostRes.of(401, "Invalid Password", null));
	}

	@PostMapping("/refresh")
	@ApiOperation(value = "토큰 갱신", notes = "<strong>Refresh 토큰</strong>을 통해 새로운 Access 토큰을 발급받는다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공", response = UserLoginPostRes.class),
			@ApiResponse(code = 401, message = "인증 실패", response = BaseResponseBody.class),
			@ApiResponse(code = 404, message = "사용자 없음", response = BaseResponseBody.class),
			@ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
	})
	public ResponseEntity<UserLoginPostRes> refresh(@RequestBody @ApiParam(value="Refresh 토큰 정보", required = true) String refreshToken
		,@RequestBody @ApiParam(value="new Access 토큰을 요청한 유저 ID", required = true) String userId) {
		// refreshToken을 검증하고, 새로운 Access 토큰을 발급받는다.
		String newAccessToken = JwtTokenUtil.renewAccessTokenWithRefreshToken(refreshToken, userId);
		// 응답을 반환한다.
		return ResponseEntity.ok(UserLoginPostRes.of(200, "Success", newAccessToken));
	}
}
