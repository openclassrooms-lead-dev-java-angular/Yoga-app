package com.openclassrooms.starterjwt.controllers;


import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.services.SessionService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sessions")
@Validated
public class SessionController {

    private final SessionService sessionService;

    @GetMapping("/{id}")
    public SessionDto findById(
            @PathVariable("id") Long id
    ) {
        return sessionService.getById(id);
    }

    @GetMapping("")
    public List<SessionDto> findAll() {
        return this.sessionService.findAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping()
    public SessionDto create(
            @Valid @RequestBody SessionDto sessionDto
    ) {
        return sessionService.create(sessionDto);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("{id}")
    @ResponseStatus(HttpStatus.OK)
    public SessionDto update(
            @PathVariable("id") Long id,
            @Valid @RequestBody SessionDto sessionDto
    ) {
        return sessionService.update(id, sessionDto);
    }

    @DeleteMapping("{id}")
    public void delete(
            @PathVariable("id") Long id
    ) {
        this.sessionService.delete(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("{id}/participate/{userId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void participate(
            @PathVariable("id") Long id,
            @PathVariable("userId") Long userId
    ) {
        this.sessionService.participate(id, userId);

    }

    @DeleteMapping("{id}/participate/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void noLongerParticipate(
            @PathVariable("id") Long id,
            @PathVariable("userId") Long userId
    ) {
            this.sessionService.noLongerParticipate(id, userId);
    }
}
