package com.openclassrooms.starterjwt.controllers;


import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.dto.request.LoginRequestDto;
import com.openclassrooms.starterjwt.dto.request.SignupRequestDto;
import com.openclassrooms.starterjwt.dto.response.JwtResponseDto;
import com.openclassrooms.starterjwt.dto.response.MessageResponseDto;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;


    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequestDto loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        boolean isAdmin = false;
        User user = this.userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (user != null) {
            isAdmin = user.isAdmin();
        }

        return ResponseEntity.ok(new JwtResponseDto(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getFirstName(),
                userDetails.getLastName(),
                isAdmin));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequestDto signUpRequestDto) {
        if (userRepository.existsByEmail(signUpRequestDto.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponseDto("Error: Email is already taken!"));
        }

        // Create new user's account
        User user = new User(signUpRequestDto.getEmail(),
                signUpRequestDto.getLastName(),
                signUpRequestDto.getFirstName(),
                passwordEncoder.encode(signUpRequestDto.getPassword()),
                false);

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponseDto("User registered successfully!"));
    }
}
