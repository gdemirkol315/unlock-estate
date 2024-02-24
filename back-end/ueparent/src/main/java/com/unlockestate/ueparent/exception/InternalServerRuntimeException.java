package com.unlockestate.ueparent.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR, reason = "Internal Server Error")
public class InternalServerRuntimeException extends RuntimeException {

    public InternalServerRuntimeException(String message) {
        super(message);
    }

    // You can add more constructors or methods as needed
}