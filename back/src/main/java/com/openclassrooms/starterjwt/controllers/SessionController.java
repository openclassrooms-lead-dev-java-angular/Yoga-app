package com.openclassrooms.starterjwt.controllers;


import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/session")
@Validated
public class SessionController {

    private final SessionMapper sessionMapper;
    private final SessionService sessionService;


    @GetMapping("/{id}")
    public SessionDto findById(
            @PathVariable("id") Long id
    ) {
        Session session = sessionService.getById(id);

        return this.sessionMapper.toDto(session);
    }

    @GetMapping()
    public List<SessionDto> findAll() {
        List<Session> sessions = this.sessionService.findAll();

        return this.sessionMapper.toDto(sessions);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping()
    public SessionDto create(
            @Valid @RequestBody SessionDto sessionDto
    ) {
        System.out.println("post");
        Session session = sessionMapper.toEntity(sessionDto);
        Session created = sessionService.create(session);

        return sessionMapper.toDto(created);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("{id}")
    public SessionDto update(
            @PathVariable("id") Long id,
            @Valid @RequestBody SessionDto sessionDto
    ) {
        Session session = sessionService.update(id, sessionMapper.toEntity(sessionDto));

        return sessionMapper.toDto(session);

    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> delete(
            @PathVariable("id") Long id
    ) {
        this.sessionService.delete(id);

        return ResponseEntity
                .ok()
                .build();
    }

    @PostMapping("{id}/participate/{userId}")
    public ResponseEntity<?> participate(
            @PathVariable("id") Long id,
            @PathVariable("userId") Long userId
    ) {

        this.sessionService.participate(id, userId);

        return ResponseEntity
                .ok()
                .build();
    }

    @DeleteMapping("{id}/participate/{userId}")
    public ResponseEntity<?> noLongerParticipate(
            @PathVariable("id") Long id,
            @PathVariable("userId") Long userId
    ) {
            this.sessionService.noLongerParticipate(id, userId);

            return ResponseEntity.ok().build();
    }
}
