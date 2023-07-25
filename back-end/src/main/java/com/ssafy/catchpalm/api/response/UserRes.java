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
	@ApiModelProperty(name="User ID")
	String userId;
	@ApiModelProperty(name="User Nickname")
	String userNickname;
	@ApiModelProperty(name="User age")
	int age;
	@ApiModelProperty(name="User sex")
	int sex;
	
	public static UserRes of(User user) {
		UserRes res = new UserRes();
		res.setUserId(user.getUserId());
		res.setUserNickname(user.getNickname());
		res.setAge(user.getAge());
		res.setSex(user.getSex());
		return res;
	}
}
