package com.unlockestate.ueparent.auth.controller;

import com.unlockestate.ueparent.auth.dto.User;
import com.unlockestate.ueparent.auth.service.UserService;
import com.unlockestate.ueparent.exception.InternalServerRuntimeException;
import com.unlockestate.ueparent.utils.dto.MessageEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


import java.util.Optional;


@RestController
public class UserController {

    private final UserService userService;

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/updateUser")
    public ResponseEntity<User> updateUser(@RequestBody User user) {

        User resultUser = new User();

        try {
            if (user != null) {
                resultUser = userService.updateUser(user.getEmail(),user).orElseThrow();
            }
        } catch (InternalServerRuntimeException e) {
            logger.error("Could not find user!");
        }

        return ResponseEntity.ok(resultUser);

    }
}
