package com.unlockestate.ueparent.task.repository;

import com.unlockestate.ueparent.task.dto.TaskCheckListItem;
import com.unlockestate.ueparent.user.dto.User;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface TaskCheckListItemRepository extends JpaRepository<TaskCheckListItem, Integer> {
    @Modifying
    @Query(value = "update task_check_list_item set status = ?1 where id = ?2", nativeQuery = true)
    void setStatus(String status, Integer taskCheckListItemId);
}
