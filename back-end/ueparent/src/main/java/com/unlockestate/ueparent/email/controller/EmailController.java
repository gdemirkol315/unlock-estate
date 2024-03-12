package com.unlockestate.ueparent.email.controller;

import com.unlockestate.ueparent.email.dto.Email;
import com.unlockestate.ueparent.email.service.EmailService;
import com.unlockestate.ueparent.task.dto.TaskCheckListItem;
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
@RequestMapping("/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    @PostMapping("/send")
    public ResponseEntity<MessageEntity> updateTaskChecklistItem(
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
