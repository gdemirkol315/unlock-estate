package com.unlockestate.ueparent.auth.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Salt")
public class Salt {
    @Id
    private String email;
    private String salt;

    public Salt() {
    }

    public Salt(String email, String salt) {
        this.email = email;
        this.salt = salt;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }
}
