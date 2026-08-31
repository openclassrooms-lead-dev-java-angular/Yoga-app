package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Log4j2
public class SessionService {

    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final SessionMapper sessionMapper;


    @Transactional()
    public SessionDto create(SessionDto sessionDto) {
        Session session = sessionMapper.toEntity(sessionDto);

        Session createdSession = sessionRepository.save(session);

        log.info("Session created with id {}", session.getId());

        return sessionMapper.toDto(createdSession);
    }

    @Transactional()
    public void delete(Long id) {
        Session session = this.sessionRepository.findById(id)
                .orElseThrow(NotFoundException::new);

        sessionRepository.delete(session);
        log.info("Session deleted with id {}", id);
    }

    @Transactional(readOnly = true)
    public List<SessionDto> findAll() {

        List<Session> sessions =  this.sessionRepository.findAll();

        return this.sessionMapper.toDto(sessions);
    }

    @Transactional(readOnly = true)
    public SessionDto getById(Long id) {
        Session session =  this.sessionRepository
                .findById(id)
                .orElseThrow(NotFoundException::new);

        return this.sessionMapper.toDto(session);
    }

    @Transactional()
    public SessionDto update(Long id, SessionDto sessionDto) {

        if (!sessionRepository.existsById(id)) {
            throw new NotFoundException();
        }

        sessionDto.setId(id);

        Session currentSession = sessionRepository
                .findById(id)
                .orElseThrow(NotFoundException::new);

        sessionMapper.updateEntity(sessionDto, currentSession);

        Session updatedSession = sessionRepository.save(currentSession);

        log.info("Session updated with id ");
        return sessionMapper.toDto(updatedSession);
    }

    @Transactional()
    public void participate(Long id, Long userId) {
        // exist by id
        Session session = this.sessionRepository
                .findById(id)
                .orElseThrow(NotFoundException::new);

        User user = this.userRepository
                .findById(userId)
                .orElseThrow(NotFoundException::new);

        if (alreadyParticipate(session, userId)) {
            throw new BadRequestException();
        }

        session.getUsers().add(user);

        this.sessionRepository.save(session);
    }

    @Transactional()
    public void noLongerParticipate(Long id, Long userId) {
        // exist by ...
        // user in session, user exists- jpa
        Session session = this.sessionRepository
                .findById(id)
                .orElseThrow(NotFoundException::new);

        if (!alreadyParticipate(session, userId)) {
            throw new BadRequestException();
        }

        session.setUsers(session.getUsers().stream().filter(user -> !user.getId().equals(userId)).collect(Collectors.toList()));
//        session.getUsers().removeIf(user -> user.getId().equals(userId));
        this.sessionRepository.save(session);
    }

    private Boolean alreadyParticipate(Session session, Long userId) {
        // check with srping data jpa.
        return session
                .getUsers()
                .stream()
                .anyMatch(o -> o.getId().equals(userId));
    }
}
