package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private final UserMapper userMapper;
    private final UserService userService;


    @GetMapping("/{id}")
    public UserDto findById(
            @PathVariable("id") Long id
    ) {
        User user = this.userService.findById(id);
        return userMapper.toDto(user);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> save(
            @PathVariable("id") Long id
    ) {
        userService.delete(id);
        return ResponseEntity
                .ok()
                .build();
    }
}
