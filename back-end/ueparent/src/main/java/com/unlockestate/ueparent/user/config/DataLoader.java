package com.unlockestate.ueparent.user.config;

import com.unlockestate.ueparent.user.dto.Role;
import com.unlockestate.ueparent.user.dto.User;
import com.unlockestate.ueparent.user.repository.UserRepository;
import com.unlockestate.ueparent.user.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AuthenticationService authenticationService;
    @Value("${initial.user}")
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