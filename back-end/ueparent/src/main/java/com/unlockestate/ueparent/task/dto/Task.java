package com.unlockestate.ueparent.task.dto;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.unlockestate.ueparent.realestate.dto.RealEstate;
import com.unlockestate.ueparent.task.repository.Status;
import com.unlockestate.ueparent.user.dto.User;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonBackReference("task-real-estate")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "real_estate_id")
    private RealEstate realEstate;

    @JsonManagedReference("task-comment")
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments;

    @JsonBackReference("assignee-task")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assignee_user_id")
    private User assignee;

    @JsonBackReference("creator-task")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "creator_user_id")
    private User creator;
    @JsonManagedReference("task-task-check-list-item")
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TaskCheckListItem> taskCheckListItems;

    private Date taskDate;
    private Date startTime;
    private Date finishTime;
    private Date createdDate;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "varchar default 'PENDING'")
    private Status  status;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public RealEstate getRealEstate() {
        return realEstate;
    }

    public void setRealEstate(RealEstate realEstate) {
        this.realEstate = realEstate;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public User getAssignee() {
        return assignee;
    }

    public void setAssignee(User assignee) {
        this.assignee = assignee;
    }

    public List<TaskCheckListItem> getTaskCheckListItems() {
        return taskCheckListItems;
    }

    public void setTaskCheckListItems(List<TaskCheckListItem> taskCheckListItems) {
        this.taskCheckListItems = taskCheckListItems;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    public Date getTaskDate() {
        return taskDate;
    }

    public void setTaskDate(Date taskDate) {
        this.taskDate = taskDate;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getFinishTime() {
        return finishTime;
    }

    public void setFinishTime(Date finishTime) {
        this.finishTime = finishTime;
    }
}
