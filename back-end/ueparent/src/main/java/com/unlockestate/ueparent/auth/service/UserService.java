package com.unlockestate.ueparent.auth.service;

import com.unlockestate.ueparent.auth.dto.Role;
import com.unlockestate.ueparent.auth.dto.User;
import com.unlockestate.ueparent.auth.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
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

    /**
     * Updates a user's details.
     *
     * @param email the ID of the user to update
     * @param updatedUser contains the data to update the user with
     * @return the updated user, or Optional.empty() if the user was not found
     */
    @Transactional
    public Optional<User> updateUser(String email, User updatedUser) {
        // First, check if the user with the specified ID exists
        Optional<User> existingUserOpt = userRepository.findByEmail(email);

        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();

            // Update the existing user's properties with the values from the updated user
            existingUser.setLastName(updatedUser.getLastName());
            existingUser.setPreferredArea(updatedUser.getPreferredArea());
            existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
            existingUser.setRole(updatedUser.getRole());
            // Add more fields to update as needed

            // Save the updated user back to the database
            userRepository.save(existingUser);
            existingUser.setPassword(null);
            // Return the updated user
            return Optional.of(existingUser);
        } else {
            // Return Optional.empty() if the user was not found
            return Optional.empty();
        }
    }
}
