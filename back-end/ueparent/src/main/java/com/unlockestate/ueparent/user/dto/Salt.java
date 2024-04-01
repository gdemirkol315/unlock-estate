package com.unlockestate.ueparent.user.dto;

import jakarta.persistence.*;

@Entity
@Table(name = "Salt")
public class Salt {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(unique = true)
    private String email;
    private String saltString;

    public Salt() {
    }

    public Salt(String email, String salt) {
        this.email = email;
        this.saltString = salt;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSaltString() {
        return saltString;
    }

    public void setSaltString(String saltString) {
        this.saltString = saltString;
    }
}
