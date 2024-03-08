package com.unlockestate.ueparent.task.repository;

import com.unlockestate.ueparent.task.dto.TaskCheckListItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskCheckListItemRepository extends JpaRepository<TaskCheckListItem, Integer> {
}
