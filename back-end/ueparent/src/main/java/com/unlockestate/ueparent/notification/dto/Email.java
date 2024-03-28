package com.unlockestate.ueparent.notification.dto;

public class Email {

    private String to;
    private String content;
    private String header;

    public Email() {
    }

    public Email(String to, String content, String header) {
        this.to = to;
        this.content = content;
        this.header = header;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getHeader() {
        return header;
    }

    public void setHeader(String header) {
        this.header = header;
    }
}
