package com.ssafy.catchpalm.api.controller;

import com.google.api.client.util.Value;
import io.openvidu.java.client.*;

import io.swagger.annotations.Api;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Api(value = "openVidu API", tags = {"openVidu."})
@RestController
public class VideoController {

    @GetMapping("/test-openvidu")
    public String testOpenVidu() {
        OpenVidu openVidu = new OpenVidu("https://localhost:8443", "ssafy");
        try {
            SessionProperties sessionProperties = new SessionProperties.Builder().build();
            Session session = openVidu.createSession(sessionProperties);

            // 새로운 세션을 만든 후 해당 세션의 ID를 반환합니다.
            return "New OpenVidu Session ID: " + session.getSessionId();
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            // 에러가 발생한 경우 에러 메시지를 반환합니다.
            return "Error: " + e.getMessage();
        }
    }
}


