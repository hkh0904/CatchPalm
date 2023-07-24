package com.ssafy.catchpalm.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service("emailService")
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender emailSender;
    private static String adminEmail;

    @Autowired
    public EmailServiceImpl(@Value("${spring.mail.username}") String adminEmail,JavaMailSender emailSender) {
        this.emailSender = emailSender;
        this.adminEmail = adminEmail;
    }


    @Override
    public void sendVerificationEmail(String userEmail, String emailVerificationToken) {
        String verificationUrl = "http://localhost:8080/api/v1/auth/verifyEmail?token=" + emailVerificationToken;
        // Call your method to send an email, passing the verification URL.
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(adminEmail); // 여기에는 실제 발신 이메일 주소를 입력해야 합니다.
        message.setTo(userEmail);
        message.setSubject("Email Verification");
        message.setText("Please click the following link to verify your email: " + verificationUrl);
        emailSender.send(message);
    }
}
