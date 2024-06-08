package com.unlockestate.ueparent.task.dto;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.unlockestate.ueparent.user.dto.User;
import jakarta.persistence.*;

@Entity
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String description;
    private Double amount;

    @JsonBackReference("author-expense")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_email")
    private User author;

    @JsonBackReference("task-expense")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    private Task task;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

}