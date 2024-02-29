package com.unlockestate.ueparent.task.dto;


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

    private String status;



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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
