package com.unlockestate.ueparent.notification.service;

import com.unlockestate.ueparent.notification.dto.Email;
import com.unlockestate.ueparent.task.controller.TaskController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender emailSender;

    @Value("${spring.mail.username}")
    private String from;

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    public void sendSimpleMessage(
            Email email) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(email.getTo());
            message.setSubject(email.getHeader());
            message.setText(email.getContent());
            emailSender.send(message);
        } catch (RuntimeException e) {
            logger.error("Error sending email!");
            throw new RuntimeException("Could not send email!");
        }

    }
}
