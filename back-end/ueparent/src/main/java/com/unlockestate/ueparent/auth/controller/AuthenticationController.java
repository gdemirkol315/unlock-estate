package com.unlockestate.ueparent.auth.controller;

import com.unlockestate.ueparent.auth.dto.AuthenticationResponse;
import com.unlockestate.ueparent.auth.dto.User;
import com.unlockestate.ueparent.auth.service.AuthenticationService;
import com.unlockestate.ueparent.auth.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/user")
    public ResponseEntity<User> getUserDetails(
            @RequestParam String email
    ) {
        return ResponseEntity.ok(userService.getUser(email));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/allUsers")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/roles")
    public ResponseEntity<List<String>> getRoles() {
        return ResponseEntity.ok(userService.getAllRoles());
    }
}
