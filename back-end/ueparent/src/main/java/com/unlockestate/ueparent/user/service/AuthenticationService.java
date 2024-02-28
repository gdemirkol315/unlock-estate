package com.unlockestate.ueparent.user.service;

import com.unlockestate.ueparent.user.dto.AuthenticationResponse;
import com.unlockestate.ueparent.user.dto.ChangePassword;
import com.unlockestate.ueparent.user.dto.Salt;
import com.unlockestate.ueparent.user.dto.User;
import com.unlockestate.ueparent.user.repository.SaltRepository;
import com.unlockestate.ueparent.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.Random;


@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final SaltRepository saltRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

    private final Random random = new Random();

    public AuthenticationService(UserRepository repository,
                                 SaltRepository saltRepository,
                                 PasswordEncoder passwordEncoder,
                                 JwtService jwtService,
                                 AuthenticationManager authenticationManager) {
        this.userRepository = repository;
        this.saltRepository = saltRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthenticationResponse register(User request) {
        User user = new User();


        user.setName(request.getName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPreferredArea(request.getPreferredArea());
        user.setActive(request.isActive());

        Salt salt = new Salt();
        salt.setSalt(createSalt());
        salt.setEmail(request.getEmail());

        salt = saltRepository.save(salt);
        user.setPassword(passwordEncoder.encode(request.getPassword() + salt.getSalt()));

        user = userRepository.save(user);
        String token = jwtService.generateToken(user);

        return new AuthenticationResponse(token);
    }

    public void authenticate(User request) throws BadCredentialsException {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword() + getSalt(request.getEmail()),
                        request.getAuthorities()
                )
        );
    }

    public AuthenticationResponse login(User request) {
        try {
            authenticate(request);
        } catch (BadCredentialsException e) {
            logger.error("Credentials provided are wrong!");
            return new AuthenticationResponse("");
        }
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        if (!user.isActive()) {
            return new AuthenticationResponse("deactivated");
        }
        String token = jwtService.generateToken(user);

        return new AuthenticationResponse(token);

    }

    public AuthenticationResponse changePassword(ChangePassword changePassword){
        try {
            authenticate(changePassword.getUser());
        } catch (BadCredentialsException e) {
            logger.error("Credentials provided are wrong!");
            return new AuthenticationResponse("");
        }

        User user = userRepository.findByEmail(changePassword.getUser().getEmail()).orElseThrow();
        user.setPassword(passwordEncoder.encode(changePassword.getNewPassword()+ getSalt(user.getEmail())));
        userRepository.save(user);

        String token = jwtService.generateToken(user);

        return new AuthenticationResponse(token);
    }


    private String createSalt() {
        StringBuilder saltStrBuilder = new StringBuilder();
        for (int i = 1; i < 20; i++) {
            saltStrBuilder.append(generateRandomChar());
        }
        return saltStrBuilder.toString();
    }

    private char generateRandomChar() {

        return (char) (random.nextInt(26) + 'a');
    }

    public String getSalt(String email) {
        Salt salt = new Salt();
        try{
            salt = saltRepository.findByEmail(email).orElseThrow();
        } catch (NoSuchElementException e) {
            logger.error("Salt not found for user {}", email);
        }
        return salt.getSalt();
    }

}
