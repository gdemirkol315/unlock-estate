package com.unlockestate.ueparent.user.dto;

public class ChangePassword {
    private User user;
    private String newPassword;


    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
