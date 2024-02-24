package com.unlockestate.ueparent.auth.service;

import com.unlockestate.ueparent.auth.dto.AuthenticationResponse;
import com.unlockestate.ueparent.auth.dto.Salt;
import com.unlockestate.ueparent.auth.dto.User;
import com.unlockestate.ueparent.auth.repository.SaltRepository;
import com.unlockestate.ueparent.auth.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Random;


@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final SaltRepository saltRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

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

        Salt salt = new Salt();
        salt.setSalt(createSalt());
        salt.setEmail(request.getEmail());

        salt = saltRepository.save(salt);
        user.setPassword(passwordEncoder.encode(request.getPassword() + salt.getSalt()));

        user = userRepository.save(user);
        String token = jwtService.generateToken(user);

        return new AuthenticationResponse(token);
    }

    public AuthenticationResponse authenticate(User request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword() + getSalt(request.getEmail()),
                        request.getAuthorities()
                )
        );

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
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
        Random r = new Random();
        return (char) (r.nextInt(26) + 'a');
    }

    public String getSalt(String email) {
        return saltRepository.findByEmail(email).orElseThrow().getSalt();
    }

}
