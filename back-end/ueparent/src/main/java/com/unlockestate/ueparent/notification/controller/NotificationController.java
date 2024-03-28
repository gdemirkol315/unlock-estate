package com.unlockestate.ueparent.notification.controller;

import com.unlockestate.ueparent.notification.dto.Email;
import com.unlockestate.ueparent.notification.service.EmailService;
import com.unlockestate.ueparent.utils.dto.MessageEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notification")
public class NotificationController {


    private final EmailService emailService;

    @Autowired
    public NotificationController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    @PostMapping("/sendEmail")
    public ResponseEntity<MessageEntity> sendEmail(
            @RequestBody Email email
    ) {
        try {
            emailService.sendSimpleMessage(email);
            return ResponseEntity.ok(new MessageEntity("OK"));
        } catch (RuntimeException e){
            return ResponseEntity.status(HttpStatusCode.valueOf(500)).build();
        }

    }

}
