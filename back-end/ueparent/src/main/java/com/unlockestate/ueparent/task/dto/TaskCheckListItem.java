package com.unlockestate.ueparent.task.dto;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.unlockestate.ueparent.task.repository.Status;
import jakarta.persistence.*;

@Entity
@IdClass(TaskCheckListItemId.class)
public class TaskCheckListItem {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    @JsonBackReference("task-task-check-list-item")
    private Task task;

    @Id
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "checklist_item_id")
    private CheckListItem checklistItem;

    @Enumerated(EnumType.STRING)
    private Status status;

    public TaskCheckListItem() {
    }

    public TaskCheckListItem(Task task, CheckListItem checklistItem, Status status) {
        this.task = task;
        this.checklistItem = checklistItem;
        this.status = status;
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
