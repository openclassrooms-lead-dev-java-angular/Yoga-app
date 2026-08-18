package com.openclassrooms.starterjwt.exception;

import com.openclassrooms.starterjwt.dto.response.ErrorResponseDto;
import jakarta.servlet.ServletException;

import lombok.extern.log4j.Log4j2;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.IOException;
import java.time.Instant;

@RestControllerAdvice
@Log4j2
public class GlobalExceptionHandler {

    private final String BadRequestMessage = "The request is invalid.";
    private final String NotFoundMessage = "The requested resource was not found.";
    private final String UnauthorizedMessage = "The requested resource was not found.";
    private final String InternalServerErrorMessage = "An unexpected error occurred.";

    // BAD_REQUEST

    /**
     * BadRequestException
     *
     * @param e exception message string
     * @return ErrorResponse dto
     */
    @ExceptionHandler(value = BadRequestException.class)
    public ResponseEntity<ErrorResponseDto> handleBadRequestException(BadRequestException e) {
        log.warn(e);
        return buildResponse(HttpStatus.BAD_REQUEST, BadRequestMessage);
    }

    /**
     * MethodArgumentNotValidException
     */
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDto> handleMethodArgumentNotValidException(NumberFormatException e) {
        log.warn(e);
        return buildResponse(HttpStatus.BAD_REQUEST, BadRequestMessage);
    }

    /**
     * ConstraintViolationException
     */
    @ExceptionHandler(value = NumberFormatException.class)
    public ResponseEntity<ErrorResponseDto> handleConstraintViolationException(NumberFormatException e) {
        log.warn(e);
        return buildResponse(HttpStatus.BAD_REQUEST, BadRequestMessage);
    }

    /**
     * Email conflict
     *
     * Maybe this http status to 409 conflict, check in front
     *
     * @param e exception
     * @return ErrorResponseDto
     */
    @ExceptionHandler(value = ConflictException.class)
    public ResponseEntity<ErrorResponseDto> handleConflictException(ConflictException e) {
        log.warn(e);
        return buildResponse(HttpStatus.BAD_REQUEST, e.getMessage());
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
        log.warn(e);
        return buildResponse(HttpStatus.NOT_FOUND, NotFoundMessage);
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
        log.warn(e);
        return buildResponse(HttpStatus.UNAUTHORIZED, UnauthorizedMessage);
    }

    @ExceptionHandler(value = UnauthorizedException.class)
    public ResponseEntity<ErrorResponseDto> handleUnauthorizedException(UnauthorizedException e) {
        log.warn(e);
        return buildResponse(HttpStatus.UNAUTHORIZED, UnauthorizedMessage);
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
        log.error(e);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, InternalServerErrorMessage);
    }

    /**
     * ServletException
     *
     * @param e exception message string
     * @return ErrorResponseDto
     */
    @ExceptionHandler(value = ServletException.class)
    public ResponseEntity<ErrorResponseDto> handleServletException(ServletException e) {
        log.error(e);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, InternalServerErrorMessage);
    }

    /**
     * Exception
     *
     * @param e exception message string
     * @return ErrorResponseDto
     */
    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<ErrorResponseDto> handleException(Exception e) {
        log.error(e);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, InternalServerErrorMessage);
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

// todo remove
//? AuthenticationException     401     Authentication is required.
//  ExpiredJwtException         401     Authentication is required.
//  MalformedJwtException       401     Authentication is required.
//  UnsupportedJwtException     401     Authentication is required.
//  SignatureException          401     Authentication is required.
//  IllegalArgumentException    401     Authentication is required.

