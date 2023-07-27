package com.ssafy.catchpalm.api.controller;

import com.google.api.client.auth.oauth2.AuthorizationCodeRequestUrl;
import com.google.api.client.auth.oauth2.AuthorizationCodeTokenRequest;
import com.google.api.client.auth.oauth2.AuthorizationCodeFlow;
import com.google.api.client.auth.oauth2.TokenResponse;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.ssafy.catchpalm.api.response.UserLoginPostRes;
import com.ssafy.catchpalm.api.service.UserService;
import com.ssafy.catchpalm.common.util.JwtTokenUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;

/**
 * OAuth2 인증 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "Oauth2 API", tags = {"OAuth."})
@RestController
@RequestMapping("/api/v1/oauth2")
public class OAuthController {
    private static final String CALLBACK_URI = "http://localhost:8080/api/v1/oauth2/callback";

    @Value("${google.client.id}")
    private String clientId;

    @Value("${google.client.secret}")
    private String clientSecret;

    private GoogleAuthorizationCodeFlow flow;

    @Autowired
    UserService userService;

    @GetMapping("/authorization/google")
    @ApiOperation(value = "구글 로그인 주소 반환", notes = "구글계정으로 로그인 버튼을 위한 url을 String으로 반환한다")
    public String googleLogin() {
        try {
            GoogleClientSecrets secrets = new GoogleClientSecrets()
                    .setWeb(new GoogleClientSecrets.Details()
                            .setClientId(clientId)
                            .setClientSecret(clientSecret));

            flow = new GoogleAuthorizationCodeFlow.Builder(
                    new NetHttpTransport(),
                    JacksonFactory.getDefaultInstance(),
                    secrets,
                    Arrays.asList("profile", "email")
            ).build();

            AuthorizationCodeRequestUrl authorizationUrl =
                    flow.newAuthorizationUrl().setRedirectUri(CALLBACK_URI);

            return "redirect:" + authorizationUrl;
        } catch (Exception e) {
            throw new RuntimeException("구글 로그인 오류");
        }
    }

    @GetMapping("/callback")
    public ResponseEntity<UserLoginPostRes> googleCallback(@RequestParam("code") String code) {
        try {
            TokenResponse tokenResponse =
                    flow.newTokenRequest(code).setRedirectUri(CALLBACK_URI).execute();

            GoogleTokenResponse googleTokenResponse = (GoogleTokenResponse) tokenResponse;
            GoogleIdToken idToken = googleTokenResponse.parseIdToken();
            GoogleIdToken.Payload payload = idToken.getPayload();

            String email = payload.getEmail();
            String name = (String) payload.get("name");

            // 이제 email 및 name을 사용하여 로그인 또는 회원 가입을 처리할 수 있습니다.
            if(userService.isDuplicatedUserId(email)){


            }
            System.out.println(email);
            System.out.println(name);

            return ResponseEntity.ok(UserLoginPostRes.of(200, "Success", JwtTokenUtil.getToken(email)));

        } catch (Exception e) {
            throw new RuntimeException("구글 로그인 오류");
        }
    }
}
