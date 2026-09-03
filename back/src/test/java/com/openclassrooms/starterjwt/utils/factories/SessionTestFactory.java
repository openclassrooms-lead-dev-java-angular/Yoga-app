package com.openclassrooms.starterjwt.utils.factories;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class SessionTestFactory {

    public static Session createSession() {
        Session session = new Session();
        session.setId(1L);
        session.setName("Yoga Session");
        session.setDate(new Date());
        session.setDescription("Yoga session for beginners");
        session.setTeacher(TeacherTestFactory.createTeacher());
        session.setUsers(new ArrayList<>());

        return session;
    }

    public static List<Session> createSessions() {
        Session session1 = new Session();
        session1.setId(1L);
        session1.setName("Yoga Session");
        session1.setDate(new Date());
        session1.setDescription("Yoga session for beginners");
        session1.setTeacher(TeacherTestFactory.createTeacher());
        session1.setUsers(new ArrayList<>());

        Session session2 = new Session();
        session2.setId(2L);
        session2.setName("Pilates Session");
        session2.setDate(new Date());
        session2.setDescription("Pilates session for beginners");
        session2.setTeacher(TeacherTestFactory.createTeacher());
        session2.setUsers(new ArrayList<>());

        return List.of(session1, session2);
    }

    public static SessionDto createSessionDto() {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setId(1L);
        sessionDto.setName("Yoga Session");
        sessionDto.setDate(new Date());
        sessionDto.setTeacher_id(1L);
        sessionDto.setDescription("Yoga session for beginners");
        sessionDto.setUsers(new ArrayList<>());
        sessionDto.setCreatedAt(LocalDateTime.of(2026, 9, 1, 10, 0));
        sessionDto.setUpdatedAt(LocalDateTime.of(2026, 9, 1, 10, 0));

        return sessionDto;
    }

    public static List<SessionDto> createSessionDtos() {
        SessionDto sessionDto1 = new SessionDto();
        sessionDto1.setId(1L);
        sessionDto1.setName("Yoga Session");
        sessionDto1.setDate(new Date());
        sessionDto1.setTeacher_id(1L);
        sessionDto1.setDescription("Yoga session for beginners");
        sessionDto1.setUsers(new ArrayList<>());
        sessionDto1.setCreatedAt(LocalDateTime.of(2026, 9, 1, 10, 0));
        sessionDto1.setUpdatedAt(LocalDateTime.of(2026, 9, 1, 10, 0));

        SessionDto sessionDto2 = new SessionDto();
        sessionDto2.setId(2L);
        sessionDto2.setName("Pilates Session");
        sessionDto2.setDate(new Date());
        sessionDto2.setTeacher_id(1L);
        sessionDto2.setDescription("Pilates session for beginners");
        sessionDto2.setUsers(new ArrayList<>());
        sessionDto2.setCreatedAt(LocalDateTime.of(2026, 9, 1, 11, 0));
        sessionDto2.setUpdatedAt(LocalDateTime.of(2026, 9, 1, 11, 0));

        return List.of(sessionDto1, sessionDto2);
    }

    public static SessionDto createSessionDtoWithUsers(List<Long> userIds) {
        SessionDto sessionDto = createSessionDto();
        sessionDto.setUsers(new ArrayList<>(userIds));

        return sessionDto;
    }
}