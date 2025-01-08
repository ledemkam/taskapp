package kte.fullstack.backend.exeption.handler;

import kte.fullstack.backend.exeption.NotFoundException;
import kte.fullstack.backend.exeption.RefreshTokenException;
import kte.fullstack.backend.model.reponse.ErrorApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import kte.fullstack.backend.exeption.TaskBadRequestException;

import static org.springframework.http.HttpStatus.*;

import org.springframework.http.HttpStatus;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = TaskBadRequestException.class)
    public ResponseEntity<ErrorApiResponse> handleException(TaskBadRequestException e) {
        return handleException(e, BAD_REQUEST);
    }

    @ExceptionHandler(value = NotFoundException.class)
    public ResponseEntity<ErrorApiResponse> handleException(NotFoundException e) {
        return handleException(e, NOT_FOUND);
    }

    @ExceptionHandler(value = RefreshTokenException.class)
    public ResponseEntity<ErrorApiResponse> handleException(RefreshTokenException e) {
        return handleException(e, UNAUTHORIZED);
    }

    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<ErrorApiResponse> handleException(Exception e) {
        return handleException(e, INTERNAL_SERVER_ERROR);
    }






    private ResponseEntity<ErrorApiResponse> handleException(Exception e, HttpStatus httpStatus) {
        log.error(e.getMessage(), e);
        var body = new ErrorApiResponse();
        body.setCode(httpStatus.value());
        body.setMessage(e.getMessage());
        return new ResponseEntity<>(body, httpStatus);
    }
}
