package com.openclassrooms.starterjwt.security.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.utils.factories.UserTestFactory;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatExceptionOfType;

@ExtendWith(MockitoExtension.class)
public class UserDetailsServiceImplTest  {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @Test
    public void shouldLoadUserByUsername() {

        User user = UserTestFactory.createAdminUser();

        when(userRepository.findByEmail("admin@yoga.com"))
                .thenReturn(Optional.of(user));

        UserDetailsImpl result = (UserDetailsImpl) userDetailsServiceImpl
                .loadUserByUsername("admin@yoga.com");

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getUsername()).isEqualTo("admin@yoga.com");
        assertThat(result.getFirstName()).isEqualTo("Admin");
        assertThat(result.getLastName()).isEqualTo("Yoga");
        assertThat(result.getPassword()).isEqualTo("password");
        assertThat(result.getAdmin()).isTrue();

        verify(userRepository).findByEmail("admin@yoga.com");
    }

    @Test
    public void shouldThrowUsernameNotFoundExceptionWhenUserDoesNotExist() {

        when(userRepository.findByEmail("john@yoga.com"))
                .thenReturn(Optional.empty());

        assertThatExceptionOfType(UsernameNotFoundException.class)
                .isThrownBy(() -> userDetailsServiceImpl.loadUserByUsername("john@yoga.com"));

        verify(userRepository).findByEmail("john@yoga.com");
    }
}
