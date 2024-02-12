package com.unlockestate.ueparent.utils.dto;

public class MessageEntity {
    private String message;
    private Boolean isError;

    public MessageEntity(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getError() {
        return isError;
    }

    public void setError(Boolean error) {
        isError = error;
    }
}
