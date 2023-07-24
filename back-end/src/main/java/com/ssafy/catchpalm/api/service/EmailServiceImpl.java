package com.ssafy.catchpalm.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service("emailService")
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender emailSender;

    @Autowired
    public EmailServicImpl(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    public EmailServicImpl(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }


    @Override
    public void sendVerificationEmail(String emailVerificationToken) {
        String verificationUrl = "http://localhost:8080/api/v1/auth/verifyEmail?token=" + emailVerificationToken;
        // Call your method to send an email, passing the verification URL.
    }
}
