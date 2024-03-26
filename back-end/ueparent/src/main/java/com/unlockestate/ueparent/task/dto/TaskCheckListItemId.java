package com.unlockestate.ueparent.task.dto;

import java.io.Serializable;
import java.util.Objects;

public class TaskCheckListItemId implements Serializable {
    private Integer task;
    private Integer checklistItem;
    public TaskCheckListItemId() {}

    public TaskCheckListItemId(Integer task, Integer checklistItem) {
        this.task = task;
        this.checklistItem = checklistItem;
    }

    public Integer getTask() {
        return task;
    }

    public void setTask(Integer task) {
        this.task = task;
    }

    public Integer getChecklistItem() {
        return checklistItem;
    }

    public void setChecklistItem(Integer checklistItem) {
        this.checklistItem = checklistItem;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TaskCheckListItemId that = (TaskCheckListItemId) o;
        return Objects.equals(task, that.task) &&
                Objects.equals(checklistItem, that.checklistItem);
    }

    @Override
    public int hashCode() {
        return Objects.hash(task, checklistItem);
    }
}
