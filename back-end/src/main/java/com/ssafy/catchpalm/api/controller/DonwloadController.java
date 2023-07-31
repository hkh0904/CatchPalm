package com.ssafy.catchpalm.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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
import org.springframework.web.servlet.view.RedirectView;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

/**
 * 다운로드 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "다운로드 API", tags = {"download."})
@RestController
@RequestMapping("/api/v1/download")
public class DonwloadController {
}
