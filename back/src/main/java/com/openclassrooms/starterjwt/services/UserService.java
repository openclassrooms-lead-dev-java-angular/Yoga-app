package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.exception.UnauthorizedException;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import java.util.Objects;

@Log4j2
@RequiredArgsConstructor
@Service
public class UserService {

    private final UserMapper userMapper;
    private final UserRepository userRepository;

    @Transactional
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new NotFoundException();
        }

        User user = userRepository
                .getReferenceById(id);

        UserDetails userDetails = (UserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        if (!Objects.equals(userDetails.getUsername(), user.getEmail())) {
            throw new UnauthorizedException();
        }

        userRepository.deleteById(id);
        log.info("User deleted with id {}", id);
    }

    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository
                .findById(id)
                .orElseThrow(NotFoundException::new);
    }

    @Transactional(readOnly = true)
    public UserDto loadById(Long id) {
        return userRepository
                .findById(id)
                .map(userMapper::toDto)
                .orElseThrow(NotFoundException::new);
    }

    @Transactional
    public void save(User user) {
        userRepository.save(user);
        log.info("User saved with id {}", user.getId());
    }

    @Transactional(readOnly = true)
    public Boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
