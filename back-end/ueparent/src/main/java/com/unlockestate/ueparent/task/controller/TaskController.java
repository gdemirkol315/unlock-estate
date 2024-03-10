package com.unlockestate.ueparent.task.controller;

import com.unlockestate.ueparent.task.dto.Comment;
import com.unlockestate.ueparent.exception.InternalServerRuntimeException;
import com.unlockestate.ueparent.task.dto.Task;
import com.unlockestate.ueparent.task.dto.TaskCheckListItem;
import com.unlockestate.ueparent.task.service.TaskService;
import com.unlockestate.ueparent.user.dto.User;
import com.unlockestate.ueparent.utils.dto.MessageEntity;
import com.unlockestate.ueparent.utils.dto.UserDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/task")
@RestController
public class TaskController {

    private static final Logger logger = LoggerFactory.getLogger(TaskController.class);
    private TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/tasks")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<List<Task>> allTasks() {
        try {
            return ResponseEntity.ok(taskService.getTasks());
        } catch (InternalServerRuntimeException e) {
            logger.error("Could not get real estates");
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/task")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<Task> getTask(@RequestParam String id) {
        try {
            return ResponseEntity.ok(taskService.getTask(id));
        } catch (InternalServerRuntimeException e) {
            logger.error("Could not get real estates");
            return ResponseEntity.internalServerError().build();
        }
    }

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    @PostMapping("/saveTask")
    public ResponseEntity<Task> saveTask(
            @RequestBody Task task
    ) {
        return ResponseEntity.ok(taskService.saveTask(task));
    }

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    @PostMapping("/updateTaskChecklistItem")
    public ResponseEntity<MessageEntity> updateTaskChecklistItem(
            @RequestBody TaskCheckListItem taskCheckListItem
    ) {
        taskService.updateTaskChecklistItem(taskCheckListItem);
        return ResponseEntity.ok(new MessageEntity("OK"));
    }

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    @PostMapping("/addComment")
    public ResponseEntity<Comment> addComment(
            @RequestBody Comment comment
    ) {
        return ResponseEntity.ok(taskService.addComment(comment));
    }

    @GetMapping("/getComments")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<List<Comment>> getComments(@RequestParam String taskId) {
        try {
            return ResponseEntity.ok(taskService.getCommentByTaskId(taskId));
        } catch (InternalServerRuntimeException e) {
            logger.error("Could not get real estates");
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/getAuthor")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<UserDto> getAuthor(@RequestParam String commentId) {
        try {
            return ResponseEntity.ok(taskService.getAuthorByCommentId(commentId));
        } catch (InternalServerRuntimeException e) {
            logger.error("Could not get real estates");
            return ResponseEntity.internalServerError().build();
        }
    }

}
