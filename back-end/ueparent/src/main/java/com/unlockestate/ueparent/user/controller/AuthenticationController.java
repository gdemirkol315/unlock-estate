package com.unlockestate.ueparent.user.controller;

import com.unlockestate.ueparent.user.dto.AuthenticationResponse;
import com.unlockestate.ueparent.user.dto.ChangePassword;
import com.unlockestate.ueparent.user.dto.User;
import com.unlockestate.ueparent.user.service.AuthenticationService;
import com.unlockestate.ueparent.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final UserService userService;

    @Autowired
    public AuthenticationController(AuthenticationService authenticationService, UserService userService) {
        this.authenticationService = authenticationService;
        this.userService = userService;
    }
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody User request
    ) {
        request.setActive(true);
        return ResponseEntity.ok(authenticationService.register(request));

    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(
            @RequestBody User request
    ) {
        return ResponseEntity.ok(authenticationService.login(request));
    }

    @PostMapping("/changePassword")
    public ResponseEntity<AuthenticationResponse> changePassword(
            @RequestBody ChangePassword changePassword
    ) {
        return ResponseEntity.ok(authenticationService.changePassword(changePassword));
    }

}