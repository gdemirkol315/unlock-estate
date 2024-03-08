package com.unlockestate.ueparent.task.dto;


import com.unlockestate.ueparent.task.repository.Status;
import jakarta.persistence.*;

@Entity
public class TaskCheckListItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "checklist_item_id")
    private CheckListItem checklistItem;

    private Status status;

    public TaskCheckListItem() {
    }

    public TaskCheckListItem(Task task, CheckListItem checklistItem, Status status) {
        this.task = task;
        this.checklistItem = checklistItem;
        this.status = status;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public CheckListItem getChecklistItem() {
        return checklistItem;
    }

    public void setChecklistItem(CheckListItem checklistItem) {
        this.checklistItem = checklistItem;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
