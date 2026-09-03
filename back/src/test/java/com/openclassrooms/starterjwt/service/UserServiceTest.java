package com.openclassrooms.starterjwt.service;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.exception.UnauthorizedException;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.UserService;
import com.openclassrooms.starterjwt.utils.factories.UserTestFactory;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserService userService;

    private User user;


    @BeforeEach
    void setUp() {
        user = UserTestFactory.createAdminUser();

    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    /**
     *  delete(Long id)
     */

    @Test
    public void shouldDeleteUserWhenAuthenticatedUserMatchesUserEmail() {
        when(userRepository.existsById(user.getId()))
                .thenReturn(true);
        when(userRepository.getReferenceById(user.getId()))
                .thenReturn(user);

        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername())
                .thenReturn(user.getEmail());

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal())
                .thenReturn(userDetails);

        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication())
                .thenReturn(authentication);

        SecurityContextHolder.setContext(securityContext);

        userService.delete(user.getId());

        verify(userRepository).existsById(user.getId());
        verify(userRepository).getReferenceById(user.getId());
        verify(userRepository).deleteById(user.getId());

        SecurityContextHolder.clearContext();
    }

    @Test
    public void shouldThrowNotFoundExceptionWhenDeletingNonExistingUser() {
        Long userId = 1L;

        when(userRepository.existsById(userId))
                .thenReturn(false);

        assertThatThrownBy(() ->
                userService.delete(userId)
        )
                .isInstanceOf(NotFoundException.class);

        verify(userRepository).existsById(userId);

        verify(userRepository, never())
                .getReferenceById(anyLong());

        verify(userRepository, never())
                .deleteById(anyLong());
    }

    @Test
    public void shouldThrowUnauthorizedExceptionWhenAuthenticatedUserDoesNotMatchUserEmail() {
        User secondUser = UserTestFactory.createUser();
        secondUser.setId(2L);
        secondUser.setEmail("second-user@test.com");

        when(userRepository.existsById(secondUser.getId()))
                .thenReturn(true);

        when(userRepository.getReferenceById(secondUser.getId()))
                .thenReturn(secondUser);

        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername())
                .thenReturn(user.getEmail());

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal())
                .thenReturn(userDetails);

        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication())
                .thenReturn(authentication);

        SecurityContextHolder.setContext(securityContext);

        assertThatThrownBy(() ->
                userService.delete(secondUser.getId())
        )
                .isInstanceOf(UnauthorizedException.class);

        verify(userRepository).existsById(secondUser.getId());
        verify(userRepository).getReferenceById(secondUser.getId());

        verify(userRepository, never())
                .deleteById(anyLong());

        SecurityContextHolder.clearContext();
    }

    /**
     *  findById(Long id)
     */

    @Test
    public void shouldReturnUserWhenUserExists() {
        when(userRepository.findById(user.getId()))
            .thenReturn(Optional.of(user));

        User loadedUser = userService.findById(user.getId());

        assertThat(loadedUser).isEqualTo(user);
        verify(userRepository).findById(user.getId());
    }

    @Test
    public void shouldThrowNotFoundExceptionWhenUserDoesNotExist() {
        when(userRepository.findById(1L))
            .thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.findById(1L))
            .isInstanceOf(NotFoundException.class);
        verify(userRepository).findById(user.getId());
    }

    //    loadById(Long id)

    @Test
    public void shouldReturnUserDtoWhenUserExists() {
        UserDto expectedDto = new UserDto();
        expectedDto.setId(user.getId());
        expectedDto.setFirstName(user.getFirstName());
        expectedDto.setLastName(user.getLastName());
        expectedDto.setEmail(user.getEmail());


        when(userRepository.findById(user.getId()))
            .thenReturn(Optional.of(user));
        when(userMapper.toDto(user))
            .thenReturn(expectedDto);

        UserDto loadedUser = userService.loadById(user.getId());

        verify(userRepository).findById(user.getId());
        verify(userMapper).toDto(user);

        assertThat(loadedUser).isEqualTo(expectedDto);
    }

    @Test
    public void shouldThrowNotFoundExceptionWhenLoadingNonExistingUser() {
        when(userRepository.findById(1L))
            .thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.loadById(1L))
            .isInstanceOf(NotFoundException.class);

        verify(userRepository).findById(1L);
        verify(userMapper,  never()).toDto(user);
    }

    //    save(User user)

    @Test
    public void shouldSaveUser() {
        userService.save(user);

        verify(userRepository).save(user);
    }

    //    existsByEmail(String email)

    @Test
    public void shouldReturnTrueWhenEmailExists() {
        when(userRepository.existsByEmail(user.getEmail()))
            .thenReturn(true);

        Boolean userExists = userService.existsByEmail(user.getEmail());

        assertThat(userExists).isEqualTo(true);
        verify(userRepository).existsByEmail(user.getEmail());
    }

    @Test
    public void shouldReturnFalseWhenEmailDoesNotExist() {
        when(userRepository.existsByEmail(user.getEmail()))
            .thenReturn(false);

        Boolean userExists = userService.existsByEmail(user.getEmail());

        assertThat(userExists).isEqualTo(false);
        verify(userRepository).existsByEmail(user.getEmail());
    }
}

