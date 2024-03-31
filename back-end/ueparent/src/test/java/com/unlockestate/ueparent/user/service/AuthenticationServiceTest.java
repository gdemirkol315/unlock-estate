package com.unlockestate.ueparent.user.service;

import com.unlockestate.ueparent.notification.service.EmailService;
import com.unlockestate.ueparent.user.dto.Salt;
import com.unlockestate.ueparent.user.dto.User;
import com.unlockestate.ueparent.user.repository.SaltRepository;
import com.unlockestate.ueparent.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.hamcrest.Matchers.any;
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
        salt.setSalt("salt");
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
    void login() {

    }

    @Test
    void changePassword() {
    }
}