package com.openclassrooms.starterjwt.exception;

import com.openclassrooms.starterjwt.dto.response.ErrorResponseDto;
import jakarta.servlet.ServletException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.IOException;
import java.time.Instant;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // BAD_REQUEST

    /**
     * BadRequestException
     *
     * @param e exception message string
     * @return ErrorResponse dto
     */
    @ExceptionHandler(value = BadRequestException.class)
    public ResponseEntity<ErrorResponseDto> handleBadRequestException(BadRequestException e) {
        return buildResponse(HttpStatus.BAD_REQUEST, "The request is invalid.");
    }

    // NOT_FOUND

    /**
     * NotFoundException
     *
     * @param e exception message string
     * @return ErrorResponse dto
     */
    @ExceptionHandler(value = NotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleNotFoundException(NotFoundException e) {
        return buildResponse(HttpStatus.NOT_FOUND, "The requested resource was not found.");
    }

    // UNAUTHORIZED

    /**
     * UsernameNotFoundException
     *
     * @param e exception message string
     * @return ErrorResponseDto
     */
    @ExceptionHandler(value = UsernameNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleUsernameNotFoundException(UsernameNotFoundException e) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "Authentication is required.");
    }

    // INTERNAL_SERVER_ERROR

    /**
     * IOException
     *
     * @param e exception message string
     * @return ErrorResponse dto
     */
    @ExceptionHandler(value = IOException.class)
    public ResponseEntity<ErrorResponseDto> handleIOException(IOException e) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred.");
    }

    /**
     * ServletException
     *
     * @param e exception message string
     * @return ErrorResponseDto
     */
    @ExceptionHandler(value = ServletException.class)
    public ResponseEntity<ErrorResponseDto> handleServletException(ServletException e) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred.");
    }

    /**
     * Exception
     *
     * @param e exception message string
     * @return ErrorResponseDto
     */
    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<ErrorResponseDto> handleException(Exception e) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred.");
    }

    // response builder

    /**
     * Response builder
     *
     * @param status http status
     * @param message string
     * @return ResponseEntity<ErrorResponseDto>
     */
    private ResponseEntity<ErrorResponseDto> buildResponse(HttpStatus status,  String message) {
        ErrorResponseDto error = new ErrorResponseDto(
                status,
                message,
                Instant.now().toString()
        );

        return ResponseEntity
                .status(status)
                .body(error);
    }
}


//? AuthenticationException     401     Authentication is required.
//  ExpiredJwtException         401     Authentication is required.
//  MalformedJwtException       401     Authentication is required.
//  UnsupportedJwtException     401     Authentication is required.
//  SignatureException          401     Authentication is required.
//  IllegalArgumentException    401     Authentication is required.

