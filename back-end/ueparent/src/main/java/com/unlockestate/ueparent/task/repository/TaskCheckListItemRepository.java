package com.unlockestate.ueparent.task.repository;

import com.unlockestate.ueparent.task.dto.TaskCheckListItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface TaskCheckListItemRepository extends JpaRepository<TaskCheckListItem, Integer> {
    @Modifying
    @Query(value = "update task_check_list_item set status = ?1 where task_id = ?2 and checklist_item_id = ?3", nativeQuery = true)
    void setStatus(String status, Integer taskId, Integer checkListItemId);
}
