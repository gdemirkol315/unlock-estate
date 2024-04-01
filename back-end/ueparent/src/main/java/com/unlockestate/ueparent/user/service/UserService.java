package com.unlockestate.ueparent.user.service;

import com.unlockestate.ueparent.user.dto.Role;
import com.unlockestate.ueparent.user.dto.User;
import com.unlockestate.ueparent.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Service
public class UserService {
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
        return isolatePassword(users);
    }

    public List<User> getAllServiceStaff() {
        List<User> users = userRepository.findActiveUsersByRole(Role.USER.name()).orElseThrow();
        return isolatePassword(users);
    }

    public User getTaskAssignee(String taskId) {
        User user = userRepository.findAssigneeByTaskId(Integer.parseInt(taskId)).orElseThrow();
        user.setPassword(null);
        return user;
    }

    public User getTaskCreator(String taskId) {
        User user = userRepository.findCreatorByTaskId(Integer.parseInt(taskId)).orElseThrow();
        user.setPassword(null);
        return user;
    }

    public User getUser(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        user.setPassword(null);
        return user;
    }

    public List<String> getAllRoles() {
        return Stream.of(Role.values())
                .map(Enum::name).toList();
    }

    /**
     * Updates a user's details.
     *
     * @param email       the ID of the user to update
     * @param updatedUser contains the data to update the user with
     * @return the updated user, or Optional.empty() if the user was not found
     */
    @Transactional
    public Optional<User> updateUser(String email, User updatedUser) {
        // First, check if the user with the specified ID exists
        Optional<User> existingUserOpt = userRepository.findByEmail(email);

        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();

            existingUser.setLastName(updatedUser.getLastName());
            existingUser.setPreferredArea(updatedUser.getPreferredArea());
            if (updatedUser.getPhoneNumber()!=null){
                existingUser.setPhoneNumber(updatedUser.getPhoneNumber().replaceAll("\\s+", ""));
            }
            existingUser.setRole(updatedUser.getRole());
            existingUser.setActive(updatedUser.isActive());

            userRepository.save(existingUser);
            // Return the updated user
            return Optional.of(existingUser);
        } else {
            // Return Optional.empty() if the user was not found
            return Optional.empty();
        }
    }

    @Transactional
    public void deleteUserByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        userRepository.deleteById(user.getUserId());
    }
    @Transactional
    public Optional<User>  updateProfile(User user) {
        Optional<User> existingUserOpt = userRepository.findByEmail(user.getEmail());
        String principalName = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!principalName.equals(user.getEmail())){
            logger.error("Principal {} is trying to change details of user profile {}!",
                    principalName,
                    user.getEmail());
            throw new SecurityException("Security Breach!!! Unexpected party trying to change profile of a user!");
        }

        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();

            existingUser.setLastName(user.getLastName());
            existingUser.setPreferredArea(user.getPreferredArea());
            if (user.getPhoneNumber() != null) {
                existingUser.setPhoneNumber(user.getPhoneNumber().replaceAll("\\s+", ""));
            }

            userRepository.save(existingUser);
            // Return the updated user
            return Optional.of(existingUser);
        } else {
            // Return Optional.empty() if the user was not found
            return Optional.empty();
        }
    }

    public boolean hasRole(Role role){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getAuthorities().contains(new SimpleGrantedAuthority(role.name()));
    }

    public String getPrincipalName(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    public Integer getPrincipalUserId(){
        return userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).orElseThrow().getUserId();
    }

    public List<User> isolatePassword(List<User> users){
        for (User user : users) {
            user.setPassword(null);
        }

        return users;
    }
}
