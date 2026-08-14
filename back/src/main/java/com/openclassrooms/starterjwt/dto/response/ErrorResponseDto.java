package com.openclassrooms.starterjwt.dto.response;

import org.springframework.http.HttpStatus;

public record ErrorResponseDto(
        HttpStatus status,
        String message,
        String timestamp
) { }
