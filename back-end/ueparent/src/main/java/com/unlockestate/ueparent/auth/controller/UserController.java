package com.unlockestate.ueparent.auth.controller;

import com.unlockestate.ueparent.auth.dto.User;
import com.unlockestate.ueparent.auth.service.UserService;
import com.unlockestate.ueparent.exception.InternalServerRuntimeException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
public class UserController {

    private final UserService userService;

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/updateUser")
    public ResponseEntity<User> updateUser(@RequestBody User user) {

        User resultUser = new User();

        try {
            if (user != null) {
                resultUser = userService.updateUser(user.getEmail(), user).orElseThrow();
            }
        } catch (InternalServerRuntimeException e) {
            logger.error("Could not find user!");
        }

        return ResponseEntity.ok(resultUser);

    }

//    @PreAuthorize("hasAuthority('ADMIN')")
//    @DeleteMapping("/deleteUser/{userEmail}")
//    public ResponseEntity<MessageEntity> deleteUser(@PathVariable("userEmail") String userEmail) {
//        String responseMessage = "";
//        try {
//            if (userEmail != null) {
//                userService.deleteUserByEmail(userEmail);
//                responseMessage = " User deleted successfully!";
//            }
//        } catch (InternalServerRuntimeException e) {
//            logger.error("Could not find user!");
//            responseMessage = " User could not be deleted!";
//        }
//
//        return ResponseEntity.ok(new MessageEntity(responseMessage));
//    }
}