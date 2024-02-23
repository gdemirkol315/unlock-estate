package com.unlockestate.ueparent.auth.service;

import com.unlockestate.ueparent.auth.dto.Role;
import com.unlockestate.ueparent.auth.dto.User;
import com.unlockestate.ueparent.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            user.setPassword(null);
        }
        return users;
    }

    public User getUser(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        user.setPassword(null);
        return user;
    }

    public List<String> getAllRoles() {
        return Stream.of(Role.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }
}
