package com.unlockestate.ueparent.auth.config;

import com.unlockestate.ueparent.auth.controller.AuthenticationController;
import com.unlockestate.ueparent.auth.dto.Role;
import com.unlockestate.ueparent.auth.dto.User;
import com.unlockestate.ueparent.auth.repository.UserRepository;
import com.unlockestate.ueparent.auth.service.AuthenticationService;
import com.unlockestate.ueparent.auth.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AuthenticationService authenticationService;
    @Value("${initial.password}")
    private String initialUser;
    @Value("${initial.password}")
    private String initialPassword;
    public DataLoader(UserRepository userRepository, AuthenticationService userService) {
        this.userRepository = userRepository;
        this.authenticationService = userService;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail(initialUser).isEmpty()) {
            User admin = new User();
            admin.setEmail(initialUser);
            admin.setName(initialUser);
            admin.setLastName(initialUser);
            admin.setActive(true);
            admin.setRole(Role.ADMIN);
            admin.setPassword(initialPassword);
            authenticationService.register(admin);
        }
    }
}