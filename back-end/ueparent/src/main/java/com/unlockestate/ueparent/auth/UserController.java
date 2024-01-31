package com.unlockestate.ueparent.auth;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository employeeRepository) {
        this.userRepository = employeeRepository;
    }

    @GetMapping("/users")
    public Iterable<User> findAllUsers() {
        return this.userRepository.findAll();
    }

//    @PostMapping("/users")
//    public User addOneUser(@RequestBody User user) {
//        return this.userRepository.save(user);
//    }
}