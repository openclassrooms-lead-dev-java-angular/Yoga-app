package com.openclassrooms.starterjwt.controllers;


import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.dto.request.LoginRequestDto;
import com.openclassrooms.starterjwt.dto.request.SignupRequestDto;
import com.openclassrooms.starterjwt.dto.response.JwtResponseDto;
import com.openclassrooms.starterjwt.dto.response.MessageResponseDto;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {


    private final AuthService authService;

    private final UserRepository userRepository;
    private final UserMapper userMapper;


    @PostMapping("/login")
    public JwtResponseDto authenticateUser(
            @Valid @RequestBody LoginRequestDto loginRequest
    ) {
        return authService.authenticateUser(loginRequest);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @Valid @RequestBody SignupRequestDto signUpRequestDto
    ) {
        authService.registerUser(signUpRequestDto);

        return ResponseEntity.ok(new MessageResponseDto("User registered successfully!"));
    }
}
