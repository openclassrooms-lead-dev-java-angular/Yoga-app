package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
@Mapper(componentModel = "spring", uses = {UserService.class}, imports = {Arrays.class, Collectors.class, Session.class, User.class, Collections.class, Optional.class})
public abstract class SessionMapper implements EntityMapper<SessionDto, Session> {

    @Autowired
    TeacherService teacherService;
    @Autowired
    UserService userService;

    @Mappings({
            @Mapping(source = "description", target = "description"),
            @Mapping(target = "teacher", expression = "java(sessionDto.getTeacher_id() != null ? this.teacherService.findById(sessionDto.getTeacher_id()) : null)"),
            @Mapping(target = "users", expression = "java(Optional.ofNullable(sessionDto.getUsers()).orElseGet(Collections::emptyList).stream().map(user_id -> { User user = this.userService.findById(user_id); if (user != null) { return user; } return null; }).collect(Collectors.toList()))"),
    })
    public abstract Session toEntity(SessionDto sessionDto);


    @Mappings({
            @Mapping(source = "description", target = "description"),
            @Mapping(source = "session.teacher.id", target = "teacher_id"),
            @Mapping(target = "users", expression = "java(Optional.ofNullable(session.getUsers()).orElseGet(Collections::emptyList).stream().map(u -> u.getId()).collect(Collectors.toList()))"),
    })
    public abstract SessionDto toDto(Session session);


    @Mapping(target = "teacher", ignore = true)
    @Mapping(target = "users", ignore = true)
    public abstract void updateEntity(
            SessionDto dto,
            @MappingTarget Session entity
    );
}
