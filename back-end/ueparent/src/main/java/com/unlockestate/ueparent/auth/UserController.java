package com.unlockestate.ueparent.auth;

import org.springframework.web.bind.annotation.*;


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

    @PostMapping("/createUser")
    public User addOneUser(@RequestBody User user) {
        if (this.userRepository.findByEmail(user.getEmail()) == null) {
            return this.userRepository.save(user);
        }
        return null;
    }
}