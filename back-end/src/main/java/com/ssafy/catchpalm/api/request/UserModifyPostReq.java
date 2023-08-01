package com.ssafy.catchpalm.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * 유저 정보 수정 API ([POST] /api/v1/users) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@ApiModel("UserModifyPostRequest")
public class UserModifyPostReq {
	@ApiModelProperty(name="유저 nickname", example="your_nickname")
	String nickname;
	@ApiModelProperty(name="유저 Password", example="your_password")
	String password;
	@ApiModelProperty(name="유저 age", example="your_age")
	String age;
	@ApiModelProperty(name="유저 sex", example="your_sex")
	String sex;
}
