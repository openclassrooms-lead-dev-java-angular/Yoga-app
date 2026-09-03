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
        Session session = sessionRepository
                .findById(id)
                .orElseThrow(NotFoundException::new);

        sessionRepository.delete(session);
        log.info("Session deleted with id {}", id);
    }

    @Transactional(readOnly = true)
    public List<SessionDto> findAll() {
        return sessionMapper.toDto(
                sessionRepository.findAll()
        );
    }

    @Transactional(readOnly = true)
    public SessionDto getById(Long id) {
        return sessionRepository
                .findById(id)
                .map(sessionMapper::toDto)
                .orElseThrow(NotFoundException::new);
    }

    @Transactional()
    public SessionDto update(Long id, SessionDto sessionDto) {

        if (!sessionRepository.existsById(id)) {
            throw new NotFoundException();
        }

        sessionDto.setId(id);

        Session currentSession = sessionRepository
                .getReferenceById(id);

        sessionMapper.updateEntity(sessionDto, currentSession);

        log.info("Session updated with id {}", currentSession.getId());

        return sessionMapper.toDto(
                sessionRepository.save(currentSession)
        );
    }

    @Transactional()
    public void participate(Long id, Long userId) {

        if (!sessionRepository.existsById(id)
                || !userRepository.existsById(userId)) {
            throw new NotFoundException();
        }

        if (sessionRepository.existsByIdAndUsersId(id, userId)) {
            throw new BadRequestException();
        }

        Session session = sessionRepository
                .getReferenceById(id);
        User user = userRepository
                .getReferenceById(userId);

        session.getUsers().add(user);

        sessionRepository.save(session);
    }

    @Transactional()
    public void noLongerParticipate(Long id, Long userId) {

        if (!sessionRepository.existsById(id)) {
            throw new NotFoundException();
        }
        if (
                sessionRepository.existsByIdAndUsersId(id, userId)
                || !sessionRepository.existsByIdAndUsersId(id, userId)
        ) {
            throw new BadRequestException();
        }

        Session session = sessionRepository
                .getReferenceById(id);

        session.getUsers().removeIf(
                user -> user.getId().equals(userId)
        );

        sessionRepository.save(session);
    }

}
