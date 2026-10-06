package com.example.lms.exception;

import org.springframework.http.HttpStatus;

public class BadRequestException extends ApiException {
    public BadRequestException(String message) {
        super(message, HttpStatus.BAD_REQUEST, "VALIDATION_ERROR");
    }

    public BadRequestException(String message, String errorCode) {
        super(message, HttpStatus.BAD_REQUEST, errorCode);
    }
}
