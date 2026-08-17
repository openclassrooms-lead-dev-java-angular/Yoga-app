package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.exception.UnauthorizedException;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Objects;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;


    public void delete(Long id) {

        User user = userRepository
                .findById(id)
                .orElseThrow(NotFoundException::new);

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!Objects.equals(userDetails.getUsername(), user.getEmail())) {
            throw new UnauthorizedException();
        }

        this.userRepository
                .deleteById(id);
    }

    public User findById(Long id) {

        User user = this.userRepository
                .findById(id)
                .orElseThrow(NotFoundException::new);

        return user;
    }

    public User findByEmail(String email) {
        return this.userRepository.findByEmail(email)
                .orElseThrow(NotFoundException::new);
    }

    public void save(User user) {
        this.userRepository.save(user);
    }

    public Boolean existsByEmail(String email) {
        return this.userRepository.existsByEmail(email);
    }
}
