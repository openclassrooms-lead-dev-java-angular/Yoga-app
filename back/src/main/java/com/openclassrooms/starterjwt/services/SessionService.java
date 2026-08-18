package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Log4j2
public class SessionService {

    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;


    public Session create(Session session) {
        Session createdSession = sessionRepository.save(session);

        log.info("Session created with id {}", session.getId());

        return createdSession;
    }

    public void delete(Long id) {
        Session session = this.sessionRepository.findById(id)
                .orElseThrow(NotFoundException::new);

        sessionRepository.delete(session);
        log.info("Session deleted with id {}", id);
    }

    public List<Session> findAll() {
        return this.sessionRepository.findAll();
    }

    public Session getById(Long id) {
        return this.sessionRepository
                .findById(id)
                .orElseThrow(NotFoundException::new);
    }

    public Session update(Long id, Session session) {
        Session currentSession = sessionRepository
                .findById(id)
                .orElseThrow(NotFoundException::new);

        currentSession.setName(session.getName());
        currentSession.setDate(session.getDate());
        currentSession.setDescription(session.getDescription());
        currentSession.setUsers(session.getUsers());
        currentSession.setTeacher(session.getTeacher());

        Session updatedSession = sessionRepository.save(currentSession);

        log.info("Session updated with id {}", id);
        return updatedSession;
    }

    public void participate(Long id, Long userId) {

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

    public void noLongerParticipate(Long id, Long userId) {
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
        return session
                .getUsers()
                .stream()
                .anyMatch(o -> o.getId().equals(userId));
    }
}
