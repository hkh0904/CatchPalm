package com.ssafy.catchpalm.api.service;

import com.ssafy.catchpalm.api.request.UserRegisterPostReq;
import com.ssafy.catchpalm.db.entity.User;

/**
 *	유저 관련 비즈니스 로직 처리를 위한 서비스 인터페이스 정의.
 */
public interface UserService {
	User createUser(UserRegisterPostReq userRegisterInfo);
	User getUserByUserId(String userId);
	void updateRefreshToken(String userId, String refreshToken) throws Exception;
	String getRefreshTokenByUserId(String userId) throws Exception;
}
