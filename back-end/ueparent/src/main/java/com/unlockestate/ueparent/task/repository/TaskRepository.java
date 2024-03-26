package com.unlockestate.ueparent.task.repository;


import com.unlockestate.ueparent.task.dto.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Integer> {
    @Query(value = "select * from task t, users u where t.assignee_id = u.user_id and u.email = ?1", nativeQuery = true)
    Optional<List<Task>> findByAssignee(String assigneeEmail);

    @Modifying
    @Query(value = "update task set status = ?1 where id = ?2", nativeQuery = true)
    void setStatus(String status, Integer taskId);
}
