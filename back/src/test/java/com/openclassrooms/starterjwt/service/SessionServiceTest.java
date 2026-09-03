package com.openclassrooms.starterjwt.service;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;
import com.openclassrooms.starterjwt.utils.factories.SessionTestFactory;
import com.openclassrooms.starterjwt.utils.factories.UserTestFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatExceptionOfType;
import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    @InjectMocks
    private SessionService sessionService;

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SessionMapper sessionMapper;

    private User user;
    private Session session;
    private List<Session> sessions;
    private SessionDto sessionDto;
    private List<SessionDto> sessionDtos;

    @BeforeEach
    public void setup() {
        user = UserTestFactory.createUser();
        session = SessionTestFactory.createSession();
        sessions = SessionTestFactory.createSessions();
        sessionDto = SessionTestFactory.createSessionDto();
        sessionDtos = SessionTestFactory.createSessionDtos();
    }

    /**
     *  create(SessionDto sessionDto)
     */

    @Test
    public void shouldCreateSessionAndReturnSessionDto() {
        when(sessionMapper.toEntity(sessionDto))
                .thenReturn(session);
        when(sessionRepository.save(session))
                .thenReturn(session);
        when(sessionMapper.toDto(session))
                .thenReturn(sessionDto);

        SessionDto result = sessionService.create(sessionDto);

        assertThat(result).isEqualTo(sessionDto);

        verify(sessionMapper).toEntity(sessionDto);
        verify(sessionRepository).save(session);
        verify(sessionMapper).toDto(session);
    }

    /**
     *  delete(Long id)
     */

    @Test
    public void shouldDeleteSessionWhenSessionExists() {
        when(sessionRepository.findById(session.getId()))
                .thenReturn(Optional.of(session));

        sessionService.delete(session.getId());

        verify(sessionRepository).findById(session.getId());
        verify(sessionRepository).delete(session);
    }

    @Test
    public void shouldThrowNotFoundExceptionWhenDeletingNonExistingSession() {
        Long sessionId = 1L;

        when(sessionRepository.findById(sessionId))
                .thenReturn(Optional.empty());

        assertThatExceptionOfType(NotFoundException.class)
                .isThrownBy(() ->
                        sessionService.delete(sessionId)
                );

        verify(sessionRepository).findById(sessionId);
        verify(sessionRepository, never()).delete(any(Session.class));
    }

    /**
     *  findAll()
     */

    @Test
    public void shouldReturnAllSessions() {
        when(sessionRepository.findAll())
                .thenReturn(sessions);
        when(sessionMapper.toDto(sessions))
                .thenReturn(sessionDtos);

        List<SessionDto> result = sessionService.findAll();

        assertThat(result)
                .hasSize(2)
                .isEqualTo(sessionDtos);

        verify(sessionRepository).findAll();
        verify(sessionMapper).toDto(sessions);
    }

    @Test
    public void shouldReturnEmptyListWhenNoSessionsExist() {
        List<Session> sessions = Collections.emptyList();

        when(sessionRepository.findAll())
                .thenReturn(Collections.emptyList());
        when(sessionMapper.toDto(sessions))
                .thenReturn(Collections.emptyList());

        List<SessionDto> result = sessionService.findAll();

        assertThat(result).isEmpty();

        verify(sessionRepository).findAll();
        verify(sessionMapper).toDto(sessions);
    }

    /**
     *  getById(Long id)
     */

    @Test
    public void shouldReturnSessionDtoWhenSessionExists() {

        when(sessionRepository.findById(session.getId()))
                .thenReturn(Optional.of(session));
        when(sessionMapper.toDto(session))
                .thenReturn(sessionDto);

        SessionDto result = sessionService.getById(session.getId());

        assertThat(result).isEqualTo(sessionDto);

        verify(sessionRepository).findById(session.getId());
        verify(sessionMapper).toDto(session);
    }

    @Test
    public void shouldThrowNotFoundExceptionWhenGettingNonExistingSession() {
        Long sessionId = 1L;

        when(sessionRepository.findById(sessionId))
                .thenReturn(Optional.empty());

        assertThatExceptionOfType(NotFoundException.class)
                .isThrownBy(() -> sessionService.getById(sessionId));

        verify(sessionRepository).findById(sessionId);
        verify(sessionMapper, never())
                .toDto(any(Session.class));
    }

    /**
     * update(Long id, SessionDto sessionDto)
     */

    @Test
    public void shouldUpdateSessionAndReturnUpdatedSessionDto() {
        Long sessionId = 1L;

        Session currentSession = SessionTestFactory.createSession();
        SessionDto updatedSessionDto = SessionTestFactory.createSessionDto();

        when(sessionRepository.existsById(sessionId))
                .thenReturn(true);
        when(sessionRepository.findById(sessionId))
                .thenReturn(Optional.of(currentSession));
        when(sessionRepository.save(currentSession))
                .thenReturn(currentSession);
        when(sessionMapper.toDto(currentSession))
                .thenReturn(updatedSessionDto);

        SessionDto result = sessionService.update(sessionId, sessionDto);

        assertThat(sessionDto.getId()).isEqualTo(sessionId);
        assertThat(result).isEqualTo(updatedSessionDto);

        verify(sessionRepository).existsById(sessionId);
        verify(sessionRepository).findById(sessionId);
        verify(sessionMapper).updateEntity(sessionDto, currentSession);
        verify(sessionRepository).save(currentSession);
        verify(sessionMapper).toDto(currentSession);
    }

    @Test
    public void shouldThrowNotFoundExceptionWhenUpdatingNonExistingSession() {
        Long sessionId = 1L;

        when(sessionRepository.existsById(sessionId))
                .thenReturn(false);

        assertThatExceptionOfType(NotFoundException.class)
                .isThrownBy(() ->
                        sessionService.update(sessionId, sessionDto)
                );

        verify(sessionRepository).existsById(sessionId);
        verify(sessionRepository, never())
                .findById(anyLong());
        verify(sessionMapper, never())
                .updateEntity(any(SessionDto.class), any(Session.class));
        verify(sessionRepository, never())
                .save(any(Session.class));
        verify(sessionMapper, never())
                .toDto(any(Session.class));
    }

    /**
     *  participate(Long id, Long userId)
     */

    @Test
    public void shouldAddUserToSessionWhenUserDoesNotAlreadyParticipate() {

        session.setUsers(new ArrayList<>());

        when(sessionRepository.existsById(session.getId()))
                .thenReturn(true);
        when(userRepository.existsById(user.getId()))
                .thenReturn(true);
        when(sessionRepository.existsByIdAndUsersId(
                session.getId(),
                user.getId()))
                .thenReturn(false);
        when(sessionRepository.getReferenceById(session.getId()))
                .thenReturn(session);
        when(userRepository.getReferenceById(user.getId()))
                .thenReturn(user);

        sessionService.participate(session.getId(), user.getId());

        assertThat(session.getUsers())
                .contains(user);

        verify(sessionRepository).existsById(session.getId());
        verify(userRepository).existsById(user.getId());
        verify(sessionRepository).existsByIdAndUsersId(
                session.getId(),
                user.getId());
        verify(sessionRepository).getReferenceById(session.getId());
        verify(userRepository).getReferenceById(user.getId());
        verify(sessionRepository).save(session);
    }

    @Test
    public void shouldThrowNotFoundExceptionWhenParticipatingInNonExistingSession() {
        Long sessionId = 1L;
        Long userId = 1L;

        when(sessionRepository.existsById(sessionId))
                .thenReturn(false);

        assertThatExceptionOfType(NotFoundException.class)
                .isThrownBy(() ->
                        sessionService.participate(sessionId, userId)
                );

        verify(sessionRepository).existsById(sessionId);
        verify(userRepository, never())
                .existsById(anyLong());
        verify(sessionRepository, never())
                .existsByIdAndUsersId(anyLong(), anyLong());
        verify(sessionRepository, never())
                .getReferenceById(anyLong());
        verify(userRepository, never())
                .getReferenceById(anyLong());
        verify(sessionRepository, never())
                .save(any(Session.class));
    }

    @Test
    public void shouldThrowNotFoundExceptionWhenParticipatingWithNonExistingUser() {
        Long sessionId = session.getId();
        Long userId = 2L;

        when(sessionRepository.existsById(sessionId))
                .thenReturn(true);
        when(userRepository.existsById(userId))
                .thenReturn(false);

        assertThatExceptionOfType(NotFoundException.class)
                .isThrownBy(() -> sessionService.participate(sessionId, userId));

        verify(sessionRepository).existsById(sessionId);
        verify(userRepository).existsById(userId);
        verify(sessionRepository, never())
                .existsByIdAndUsersId(anyLong(), anyLong());
        verify(sessionRepository, never())
                .getReferenceById(anyLong());
        verify(userRepository, never())
                .getReferenceById(anyLong());
        verify(sessionRepository, never())
                .save(any(Session.class));
    }

    @Test
    public void shouldThrowBadRequestExceptionWhenUserAlreadyParticipates() {
        Long sessionId = session.getId();
        Long userId = user.getId();

        when(sessionRepository.existsById(sessionId))
                .thenReturn(true);
        when(userRepository.existsById(userId))
                .thenReturn(true);
        when(sessionRepository.existsByIdAndUsersId(sessionId, userId))
                .thenReturn(true);

        assertThatExceptionOfType(BadRequestException.class)
                .isThrownBy(() -> sessionService.participate(sessionId, userId));
        assertThat(session.getUsers())
                .doesNotContain(user);

        verify(sessionRepository).existsById(sessionId);
        verify(userRepository).existsById(userId);
        verify(sessionRepository)
                .existsByIdAndUsersId(sessionId, userId);
        verify(sessionRepository, never())
                .getReferenceById(anyLong());
        verify(userRepository, never())
                .getReferenceById(anyLong());
        verify(sessionRepository, never())
                .save(any(Session.class));
    }

    /**
     *  noLongerParticipate(Long id, Long userId)
     */

    @Test
    public void shouldRemoveUserFromSessionWhenUserParticipates() {

        session.setUsers(new ArrayList<>(List.of(user)));

        when(sessionRepository.findById(session.getId()))
                .thenReturn(Optional.of(session));

        when(sessionRepository.existsByIdAndUsersId(session.getId(), user.getId()))
                .thenReturn(true);

        sessionService.noLongerParticipate(session.getId(), user.getId());

        assertThat(session.getUsers()).doesNotContain(user);

        verify(sessionRepository).findById(session.getId());
        verify(sessionRepository).existsByIdAndUsersId(
                session.getId(),
                user.getId()
        );
        verify(sessionRepository).save(session);
    }

    @Test
    public void shouldThrowNotFoundExceptionWhenRemovingParticipationFromNonExistingSession() {
        Long sessionId = 1L;
        Long userId = 1L;

        when(sessionRepository.findById(sessionId))
                .thenReturn(Optional.empty());

        assertThatExceptionOfType(NotFoundException.class)
                .isThrownBy(() ->
                        sessionService.noLongerParticipate(sessionId, userId)
                );

        verify(sessionRepository).findById(sessionId);
        verify(sessionRepository, never())
                .existsByIdAndUsersId(anyLong(), anyLong());
        verify(sessionRepository, never()).save(any(Session.class));
    }

    @Test
    public void shouldThrowBadRequestExceptionWhenUserDoesNotParticipate() {
        Long userId = 2L;

        when(sessionRepository.findById(session.getId()))
                .thenReturn(Optional.of(session));

        when(sessionRepository.existsByIdAndUsersId(session.getId(), userId))
                .thenReturn(false);

        assertThatExceptionOfType(BadRequestException.class)
                .isThrownBy(() -> sessionService.noLongerParticipate(session.getId(), userId));

        verify(sessionRepository)
                .findById(session.getId());
        verify(sessionRepository)
                .existsByIdAndUsersId(session.getId(), userId);
        verify(sessionRepository, never())
                .save(any(Session.class));
    }

}
