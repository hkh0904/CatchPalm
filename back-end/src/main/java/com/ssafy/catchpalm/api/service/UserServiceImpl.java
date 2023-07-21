package com.ssafy.catchpalm.api.service;

import com.ssafy.catchpalm.common.util.AESUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ssafy.catchpalm.api.request.UserRegisterPostReq;
import com.ssafy.catchpalm.db.entity.User;
import com.ssafy.catchpalm.db.repository.UserRepository;
import com.ssafy.catchpalm.db.repository.UserRepositorySupport;

/**
 *	유저 관련 비즈니스 로직 처리를 위한 서비스 구현 정의.
 */
@Service("userService")
public class UserServiceImpl implements UserService {
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	UserRepositorySupport userRepositorySupport;
	
	@Autowired
	PasswordEncoder passwordEncoder;
	
	@Override
	public User createUser(UserRegisterPostReq userRegisterInfo) {
		User user = new User();
		user.setUserId(userRegisterInfo.getUserId());
		// 보안을 위해서 유저 패스워드 암호화 하여 디비에 저장.
		user.setPassword(passwordEncoder.encode(userRegisterInfo.getPassword()));
		user.setNickName(userRegisterInfo.getNickname());
		user.setEmail(passwordEncoder.encode(userRegisterInfo.getEmail()));

		return userRepository.save(user);
	}

	@Override
	public User getUserByUserId(String userId) {
		// 디비에 유저 정보 조회 (userId 를 통한 조회).
		User user = userRepositorySupport.findUserByUserId(userId).get();
		return user;
	}

	public void updateRefreshToken(String userId, String refreshToken) throws Exception {
		User user = getUserByUserId(userId);
		// refresh Token을 암호화
		String encryptedRefreshToken = AESUtil.encrypt(refreshToken);
		user.setRefreshToken(encryptedRefreshToken);
		userRepository.save(user);
	}

	public String getRefreshTokenByUserId(String userId) throws Exception {
		User user = userRepositorySupport.findUserByUserId(userId).get();
		String decryptRefreshToken = AESUtil.decrypt(user.getRefreshToken());
		return decryptRefreshToken;
	}

}
