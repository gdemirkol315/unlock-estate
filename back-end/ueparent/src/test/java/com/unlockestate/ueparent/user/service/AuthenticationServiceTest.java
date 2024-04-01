package com.unlockestate.ueparent.user.service;

import com.unlockestate.ueparent.notification.service.EmailService;
import com.unlockestate.ueparent.user.dto.*;
import com.unlockestate.ueparent.user.repository.SaltRepository;
import com.unlockestate.ueparent.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class AuthenticationServiceTest {


    @Mock
    UserRepository userRepository;

    @Mock
    SaltRepository saltRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    @Mock
    JwtService jwtService;

    @Mock
    AuthenticationManager authenticationManager;

    @Mock
    EmailService emailService;

    @InjectMocks
    AuthenticationService authenticationService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Captor
    ArgumentCaptor<User> userCaptor;

    @Captor
    ArgumentCaptor<Salt> saltCaptor;

    @Test
    void register() {
        // Arrange
        User request = new User();
        request.setEmail("test@test.com");
        request.setPassword("password");
        Salt salt = new Salt();
        salt.setSaltString("salt");
        salt.setEmail(request.getEmail());

        when(passwordEncoder.encode(anyString())).thenReturn("password");
        when(userRepository.save(request)).thenReturn(request);
        when(saltRepository.save(salt)).thenReturn(salt);

        // Act
        authenticationService.register(request);

        // Assert
        verify(userRepository, times(1)).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        assertEquals(request.getEmail(), savedUser.getEmail());
        assertEquals(request.getPassword(), savedUser.getPassword());

        verify(saltRepository, times(1)).save(saltCaptor.capture());
        Salt savedSalt = saltCaptor.getValue();
        assertEquals(salt.getEmail(), savedSalt.getEmail());
        //saltStr not check since randomly generated string

    }

    @Test
    void login_withCorrectCredentials_returnsToken() {
        // Arrange
        User request = new User();
        request.setEmail("test@test.com");
        request.setPassword("password");
        request.setRole(Role.ADMIN);
        request.setActive(true);


        Authentication authentication = Mockito.mock(Authentication.class);
        when(authentication.getName()).thenReturn("test@test.com");
        SecurityContextHolder.getContext().setAuthentication(authentication);
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(request));
        when(jwtService.generateToken(request)).thenReturn("token");

        // Act
        AuthenticationResponse response = authenticationService.login(request);

        // Assert
        assertEquals("token", response.getToken());
    }

    @Test
    void login_withIncorrectCredentials_returnsEmptyToken() {
        // Arrange
        User request = new User();
        request.setEmail("test@test.com");
        request.setPassword("wrongpassword");
        request.setRole(Role.USER);

        Authentication authentication = Mockito.mock(Authentication.class);
        when(authentication.getName()).thenReturn("test@test.com");
        SecurityContextHolder.getContext().setAuthentication(authentication);
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(request));
        when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException(""));

        // Act
        AuthenticationResponse response = authenticationService.login(request);

        // Assert
        assertEquals("", response.getToken());
    }

    @Test
    void login_withInactiveUser_returnsDeactivatedToken() {
        // Arrange
        User request = new User();
        request.setEmail("test@test.com");
        request.setPassword("password");
        request.setRole(Role.USER);
        request.setActive(false);

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(request));
        Authentication authentication = Mockito.mock(Authentication.class);
        when(authentication.getName()).thenReturn("test@test.com");
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Act
        AuthenticationResponse response = authenticationService.login(request);

        // Assert
        assertEquals("deactivated", response.getToken());
    }

    @Test
    void changePassword_withCorrectCredentials_returnsToken() {
        // Arrange
        ChangePassword changePassword = new ChangePassword();
        changePassword.setUser(new User());
        changePassword.getUser().setEmail("test@test.com");
        changePassword.getUser().setPassword("password");
        changePassword.getUser().setRole(Role.USER);
        changePassword.setNewPassword("newpassword");

        Authentication authentication = Mockito.mock(Authentication.class);
        when(authentication.getName()).thenReturn("test@test.com");
        SecurityContextHolder.getContext().setAuthentication(authentication);
        when(userRepository.findByEmail(changePassword.getUser().getEmail())).thenReturn(Optional.of(changePassword.getUser()));
        when(jwtService.generateToken(any(User.class))).thenReturn("token");
        when(SecurityContextHolder.getContext().getAuthentication().getName()).thenReturn(changePassword.getUser().getEmail());

        // Act
        AuthenticationResponse response = authenticationService.changePassword(changePassword);

        // Assert
        assertEquals("token", response.getToken());
    }

    @Test
    void changePassword_withIncorrectCredentials_returnsEmptyToken() {
        // Arrange
        ChangePassword changePassword = new ChangePassword();
        changePassword.setUser(new User());
        changePassword.getUser().setEmail("test@test.com");
        changePassword.getUser().setPassword("wrongpassword");
        changePassword.getUser().setRole(Role.USER);

        Authentication authentication = Mockito.mock(Authentication.class);
        when(authentication.getName()).thenReturn("test@test.com");
        SecurityContextHolder.getContext().setAuthentication(authentication);
        when(userRepository.findByEmail(changePassword.getUser().getEmail())).thenReturn(Optional.of(changePassword.getUser()));
        when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException(""));

        // Act
        AuthenticationResponse response = authenticationService.changePassword(changePassword);

        // Assert
        assertEquals("", response.getToken());
    }
}