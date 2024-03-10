package com.unlockestate.ueparent.task.repository;

public enum Status {
    PENDING("PENDING"),
    DONE("DONE"),
    ISSUE("ISSUE");

    private String value;

    private Status(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
