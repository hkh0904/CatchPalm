package com.ssafy.catchpalm.api.service;

public interface EmailService {

    void sendVerificationEmail(String userEmail, String emailVerificationToken);
}
