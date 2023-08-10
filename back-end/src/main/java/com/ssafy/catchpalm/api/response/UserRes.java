package com.ssafy.catchpalm.api.response;

import com.ssafy.catchpalm.common.model.response.BaseResponseBody;
import com.ssafy.catchpalm.db.entity.User;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * 회원 본인 정보 조회 API ([GET] /api/v1/users/me) 요청에 대한 응답값 정의.
 */
@Getter
@Setter
@ApiModel("UserResponse")
public class UserRes{
	@ApiModelProperty(name="User Number")
	long userNumber;
	@ApiModelProperty(name="User ID")
	String userId;
	@ApiModelProperty(name="User Nickname")
	String userNickname;
	@ApiModelProperty(name="User age")
	int age;
	@ApiModelProperty(name="User sex")
	int sex;
	@ApiModelProperty(name="User sex")
	double synk;
	@ApiModelProperty(name="User sex")
	double gameSound;
	@ApiModelProperty(name="User sex")
	double effectSound;
	@ApiModelProperty(name="User sex")
	double backSound;
	@ApiModelProperty(name="User sex")
	int isCam;
	
	public static UserRes of(User user) {
		UserRes res = new UserRes();
		res.setUserNumber(user.getUserNumber());
		res.setUserId(user.getUserId());
		res.setUserNickname(user.getNickname());
		res.setAge(user.getAge());
		res.setSex(user.getSex());
		res.setSynk(user.getSynk());
		res.setGameSound(user.getGameSound());
		res.setEffectSound(user.getEffectSound());
		res.setBackSound(user.getBackSound());
		res.setIsCam(user.getIsCam());
		return res;
	}
}
