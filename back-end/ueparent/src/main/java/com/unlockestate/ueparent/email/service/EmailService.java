package com.unlockestate.ueparent.email.service;

import com.unlockestate.ueparent.email.dto.Email;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender emailSender;

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    public void sendSimpleMessage  (
            Email email) throws MailSendException {

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("donotreply@checkoutnow.com");
            message.setTo(email.getTo());
            message.setSubject(email.getHeader());
            message.setText(email.getContent());
            emailSender.send(message);

    }
}
