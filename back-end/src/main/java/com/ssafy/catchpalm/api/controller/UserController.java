package com.ssafy.catchpalm.api.controller;

import com.ssafy.catchpalm.api.request.UserModifyPostReq;
import com.ssafy.catchpalm.api.request.UserUserIdPostReq;
import com.ssafy.catchpalm.api.response.UserDuplicatedPostRes;
import com.ssafy.catchpalm.api.service.EmailService;
import com.ssafy.catchpalm.common.util.AESUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.ssafy.catchpalm.api.request.UserLoginPostReq;
import com.ssafy.catchpalm.api.request.UserRegisterPostReq;
import com.ssafy.catchpalm.api.response.UserLoginPostRes;
import com.ssafy.catchpalm.api.response.UserRes;
import com.ssafy.catchpalm.api.service.UserService;
import com.ssafy.catchpalm.common.auth.SsafyUserDetails;
import com.ssafy.catchpalm.common.model.response.BaseResponseBody;
import com.ssafy.catchpalm.common.util.JwtTokenUtil;
import com.ssafy.catchpalm.db.entity.User;
import com.ssafy.catchpalm.db.repository.UserRepositorySupport;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import springfox.documentation.annotations.ApiIgnore;

import java.util.UUID;

/**
 * 유저 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "유저 API", tags = {"User"})
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
	
	@Autowired
	UserService userService;

	@Autowired
	EmailService emailService;

	@Autowired
	PasswordEncoder passwordEncoder;
	
	@PostMapping()
	@ApiOperation(value = "회원 가입", notes = "<strong>아이디와 패스워드</strong>를 통해 회원가입 한다.") 
    @ApiResponses({
        @ApiResponse(code = 200, message = "성공"),
        @ApiResponse(code = 401, message = "인증 실패"),
        @ApiResponse(code = 404, message = "사용자 없음"),
        @ApiResponse(code = 500, message = "서버 오류")
    })
	public ResponseEntity<? extends BaseResponseBody> register(
			@RequestBody @ApiParam(value="회원가입 정보", required = true) UserRegisterPostReq registerInfo) throws Exception {
		
		//임의로 리턴된 User 인스턴스. 현재 코드는 회원 가입 성공 여부만 판단하기 때문에 굳이 Insert 된 유저 정보를 응답하지 않음.
		User user = userService.createUser(registerInfo);
		userService.randomNickname(user.getUserId());

		emailService.sendVerificationEmail(user.getUserId(),user.getEmailVerificationToken());
		
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}
	
	@DeleteMapping("/logout")
	@ApiOperation(value = "로그아웃", notes = "로그인한 회원을 로그아웃 시킨다. header에 accessToken을 입력해야 한다." +
			"\n 예시 Authorization Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.e ...")
    @ApiResponses({
        @ApiResponse(code = 200, message = "성공"),
        @ApiResponse(code = 401, message = "인증 실패"),
        @ApiResponse(code = 500, message = "서버 오류 - 사용자 없음")
    })
	public ResponseEntity<? extends BaseResponseBody> logout(@ApiIgnore Authentication authentication) throws Exception {
		/**
		 * 요청 헤더 액세스 토큰이 포함된 경우에만 실행되는 인증 처리이후, 리턴되는 인증 정보 객체(authentication) 통해서 요청한 유저 식별.
		 * 액세스 토큰이 없이 요청하는 경우, 403 에러({"error": "Forbidden", "message": "Access Denied"}) 발생.
		 */
		SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
		String userId = userDetails.getUsername();
		userService.logoutUser(userId);

		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}

	@GetMapping("/me")
	@ApiOperation(value = "회원 본인 정보 조회", notes = "로그인한 회원 본인의 정보를 응답한다. header에 accessToken을 입력해야 한다." +
			"\n 예시 Authorization Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.e ...")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 500, message = "서버 오류 - 사용자 없음")
	})
	public ResponseEntity<UserRes> getUserInfo(@ApiIgnore Authentication authentication) {
		/**
		 * 요청 헤더 액세스 토큰이 포함된 경우에만 실행되는 인증 처리이후, 리턴되는 인증 정보 객체(authentication) 통해서 요청한 유저 식별.
		 * 액세스 토큰이 없이 요청하는 경우, 403 에러({"error": "Forbidden", "message": "Access Denied"}) 발생.
		 */
		SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
		String userId = userDetails.getUsername();
		User user = userService.getUserByUserId(userId);

		return ResponseEntity.status(200).body(UserRes.of(user));
	}

	@PatchMapping("/modify")
	@ApiOperation(value = "회원 본인 정보 수정", notes = "로그인한 회원 본인의 정보를 수정한다. header에 accessToken을 입력해야 한다."+
			"\n 정보 수정할 값에만 null이 아닌 값을 넣으면 수정이 됩니다. Header 예시 Authorization Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.e ...")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 500, message = "서버 오류 - 사용자 없음")
	})
	public ResponseEntity<? extends BaseResponseBody> modifyUserInfo(@ApiIgnore Authentication authentication, @RequestBody @ApiParam(value="수정할 유저 정보", required = true) UserModifyPostReq userModifyInfo) throws Exception {
		/**
		 * 요청 헤더 액세스 토큰이 포함된 경우에만 실행되는 인증 처리이후, 리턴되는 인증 정보 객체(authentication) 통해서 요청한 유저 식별.
		 * 액세스 토큰이 없이 요청하는 경우, 403 에러({"error": "Forbidden", "message": "Access Denied"}) 발생.
		 */
		SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
		String userId = userDetails.getUsername();
		User user = userService.getUserByUserId(userId);
		if(userModifyInfo.getNickname() != ""){
			if(userService.isDuplicatedNickname(userModifyInfo.getNickname())){
				return ResponseEntity.status(403).body(BaseResponseBody.of(403, "Nickname is duplicated"));
			}
			user.setNickname(userModifyInfo.getNickname());
		}
		if (userModifyInfo.getAge() != "") {
			user.setAge(Integer.parseInt(userModifyInfo.getAge()));
		}
		if (userModifyInfo.getPassword() != "") {
			user.setPassword(passwordEncoder.encode(userModifyInfo.getPassword()));
		}
		if (userModifyInfo.getSex() != "") {
			user.setSex(Integer.parseInt(userModifyInfo.getSex()));
		}
		userService.updateUser(user);

		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}



	@PutMapping("/resendemail")
	@ApiOperation(value = "메일 재전송", notes = "<strong>메일</strong>을 재전송 한다..")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 403, message = "인증된 이메일"),
			@ApiResponse(code = 500, message = "이메일 전송 오류 보통 사용자 없음")
	})
	public ResponseEntity<? extends BaseResponseBody> reSendEmail(
			@RequestBody @ApiParam(value="유저 Id 정보", required = true) UserUserIdPostReq userIdInfo) throws Exception {

		//임의로 리턴된 User 인스턴스. 현재 코드는 회원 가입 성공 여부만 판단하기 때문에 굳이 Insert 된 유저 정보를 응답하지 않음.
		User user = userService.getUserByUserId(userIdInfo.getUserId());
		userService.reSendEmail(userIdInfo.getUserId());
		emailService.sendVerificationEmail(user.getUserId(),user.getEmailVerificationToken());
		if(user.getEmailVerified() == 1){
			return ResponseEntity.status(200).body(BaseResponseBody.of(200, "already verified email so must use authentication"));
		}

		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}

	@PostMapping("/duplicated/userId")
	@ApiOperation(value = "아이디 중복검사", notes = "<strong>아이디</strong>를 통해서 중복검사를 한다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공", response = UserDuplicatedPostRes.class),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버,토큰 오류 - 인증만료 등")
	})
	public ResponseEntity<? extends BaseResponseBody> isDuplicatedUserId(@RequestBody @ApiParam(value="유저 Id 정보", required = true) UserUserIdPostReq userIdInfo) throws Exception {
		String userId = userIdInfo.getUserId();
		if(userId == null){
			return ResponseEntity.status(401).body(UserDuplicatedPostRes.of(401, "failed - userId is required"));
		}
		boolean isDuplicated = userService.isDuplicatedUserId(userIdInfo.getUserId());
		return ResponseEntity.ok(UserDuplicatedPostRes.of(200, "Success",isDuplicated));
	}

	@GetMapping("/duplicated")
	@ApiOperation(value = "닉네임 중복검사", notes = "<strong>닉네임</strong>를 통해서 중복검사를 한다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공", response = UserDuplicatedPostRes.class),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버,토큰 오류 - 인증만료 등")
	})
	public ResponseEntity<UserDuplicatedPostRes> isDuplicatedNickname(@RequestParam("nickname") @ApiParam(value="유저 닉네임", required = true) String nickname) throws Exception {
		boolean isDuplicated = userService.isDuplicatedNickname(nickname);
		return ResponseEntity.ok(UserDuplicatedPostRes.of(200, "Success",isDuplicated));
	}

}
