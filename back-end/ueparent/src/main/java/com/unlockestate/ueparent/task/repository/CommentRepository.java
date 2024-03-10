package com.unlockestate.ueparent.task.repository;

import com.unlockestate.ueparent.task.dto.Comment;
import com.unlockestate.ueparent.utils.dto.UserDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;


public interface CommentRepository extends JpaRepository<Comment, Integer> {
    Optional<List<Comment>> findByTaskId(Integer taskId);

}
