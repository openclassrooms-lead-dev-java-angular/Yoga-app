package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.dto.request.LoginRequestDto;
import com.openclassrooms.starterjwt.dto.request.SignupRequestDto;
import com.openclassrooms.starterjwt.dto.response.JwtResponseDto;
import com.openclassrooms.starterjwt.exception.ConflictException;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserService userService;


    public void registerUser(SignupRequestDto signUpRequestDto) {
        if (userService.existsByEmail(signUpRequestDto.getEmail())) {
            throw new ConflictException("Error: Email is already taken!");
        }

        // Create new user's account
        User user = userMapper.toEntity(signUpRequestDto);
        this.userService.save(user);
    }

    public JwtResponseDto authenticateUser(LoginRequestDto loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword())
        );

        SecurityContextHolder
                .getContext()
                .setAuthentication(authentication);

        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userService.findByEmail(userDetails.getUsername());

        return new JwtResponseDto(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getFirstName(),
                userDetails.getLastName(),
                user.getAdmin()
        );
    }
}
