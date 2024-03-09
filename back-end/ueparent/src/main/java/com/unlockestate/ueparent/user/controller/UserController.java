package com.unlockestate.ueparent.user.controller;

import com.unlockestate.ueparent.user.dto.User;
import com.unlockestate.ueparent.user.service.UserService;
import com.unlockestate.ueparent.exception.InternalServerRuntimeException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


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
                resultUser.setPassword(null);
            }
        } catch (InternalServerRuntimeException e) {
            logger.error("Could not find user!");
        }

        return ResponseEntity.ok(resultUser);

    }

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    @PostMapping("/updateProfile")
    public ResponseEntity<User> updateProfile(@RequestBody User user) {

        User resultUser = new User();

        try {
            if (user != null) {
                resultUser = userService.updateProfile(user).orElseThrow();
                resultUser.setPassword(null);
            }
        } catch (InternalServerRuntimeException e) {
            logger.error("Could not find user!");
        }

        return ResponseEntity.ok(resultUser);

    }

    @GetMapping("/user")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<User> getUserDetails(
            @RequestParam String email
    ) {
        return ResponseEntity.ok(userService.getUser(email));
    }

    @PreAuthorize("hasAuthority('ADMIN')  or hasAuthority('USER')")
    @GetMapping("/allUsers")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/allServiceStaff")
    public ResponseEntity<List<User>> getAllServiceStaff() {
        return ResponseEntity.ok(userService.getAllServiceStaff());
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/roles")
    public ResponseEntity<List<String>> getRoles() {
        return ResponseEntity.ok(userService.getAllRoles());
    }

}
