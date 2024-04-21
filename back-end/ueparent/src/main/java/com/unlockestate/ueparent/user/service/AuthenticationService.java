package com.unlockestate.ueparent.user.service;

import com.unlockestate.ueparent.notification.dto.Email;
import com.unlockestate.ueparent.notification.service.EmailService;
import com.unlockestate.ueparent.user.dto.AuthenticationResponse;
import com.unlockestate.ueparent.user.dto.ChangePassword;
import com.unlockestate.ueparent.user.dto.Salt;
import com.unlockestate.ueparent.user.dto.User;
import com.unlockestate.ueparent.user.repository.SaltRepository;
import com.unlockestate.ueparent.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailSendException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final EmailService emailService;

    @Value("${initial.user}")
    private String initialUser;

    @Value("${app.allowed-origin}")
    private String allowedOrigin;

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

    private final Random random = new Random();

    public AuthenticationService(UserRepository repository,
                                 SaltRepository saltRepository,
                                 PasswordEncoder passwordEncoder,
                                 JwtService jwtService,
                                 AuthenticationManager authenticationManager,
                                 EmailService emailService) {
        this.userRepository = repository;
        this.saltRepository = saltRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }

    public AuthenticationResponse register(User request) throws MailSendException {
        User user = new User();

        user.setName(request.getName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        if (request.getPhoneNumber()!= null) {
            user.setPhoneNumber(request.getPhoneNumber().replaceAll("\\s+", ""));
        }
        user.setPreferredArea(request.getPreferredArea());
        user.setActive(request.isActive());

        Salt salt = new Salt();
        salt.setSaltString(createSalt());
        salt.setEmail(request.getEmail());

        saltRepository.save(salt);
        user = userRepository.save(user);
        String token = jwtService.generateToken(user);

        if (user.getEmail().equals(initialUser)) {
            user.setPassword(passwordEncoder.encode(request.getPassword() + salt.getSaltString()));
        } else {
            String tmpPassword = createSalt();
            emailService.sendSimpleMessage(new Email(user.getEmail(),
                    "Your CheckoutNow account has been created.\n\nYour user name:\n" + user.getEmail() +
                            "\nYour temporary password:\n" + tmpPassword +
                            "\n\nPlease change your password immediately after login!\n" +
                            "Login via:\n" +
                            allowedOrigin + "\\login",
                    "CheckoutNow Account Activation"));
            //TODO bounce-back mail check if user mail does not exists
            user.setPassword(passwordEncoder.encode(tmpPassword + salt.getSaltString()));
        }

        return new AuthenticationResponse(token);
    }

    public void authenticate(User request) throws BadCredentialsException, NoSuchElementException {
        if (userRepository.findByEmail(request.getEmail()).orElseThrow() != null) {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword() + getSalt(request.getEmail()),
                            request.getAuthorities()
                    )
            );
        }
    }

    public AuthenticationResponse login(User request) {
        try {
            authenticate(request);
        } catch (BadCredentialsException | NoSuchElementException e) {
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

    public AuthenticationResponse changePassword(ChangePassword changePassword) {
        try {
            authenticate(changePassword.getUser());
        } catch (BadCredentialsException e) {
            logger.error("Credentials provided are wrong!");
            return new AuthenticationResponse("");
        } catch (NoSuchElementException e) {
            logger.error("User not found!");
            return new AuthenticationResponse("");
        }

        String principalName = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!principalName.equals(changePassword.getUser().getEmail())) {
            logger.error("Principal {} is trying to change password of user {}!",
                    principalName,
                    changePassword.getUser().getEmail());
            throw new SecurityException("Security Breach!!! Unexpected party trying to change password of a user!");
        }

        User user = userRepository.findByEmail(changePassword.getUser().getEmail()).orElseThrow();
        user.setPassword(passwordEncoder.encode(changePassword.getNewPassword() + getSalt(user.getEmail())));
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
        try {
            salt = saltRepository.findByEmail(email).orElseThrow();
        } catch (NoSuchElementException e) {
            logger.error("Salt not found for user {}", email);
        }
        return salt.getSaltString();
    }

}
