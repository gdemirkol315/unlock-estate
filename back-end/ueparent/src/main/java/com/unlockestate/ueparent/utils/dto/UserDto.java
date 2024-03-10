package com.unlockestate.ueparent.utils.dto;

public class UserDto {

    private Integer userId;
    private String name;
    private String lastName;

    public UserDto(Integer userId, String name, String lastName) {
        this.userId = userId;
        this.name = name;
        this.lastName = lastName;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}
