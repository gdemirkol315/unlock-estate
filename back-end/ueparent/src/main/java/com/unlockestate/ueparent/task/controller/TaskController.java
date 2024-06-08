package com.unlockestate.ueparent.task.controller;

import com.unlockestate.ueparent.task.dto.Comment;
import com.unlockestate.ueparent.exception.InternalServerRuntimeException;
import com.unlockestate.ueparent.task.dto.Expense;
import com.unlockestate.ueparent.task.dto.Task;
import com.unlockestate.ueparent.task.dto.TaskCheckListItem;
import com.unlockestate.ueparent.task.service.TaskService;
import com.unlockestate.ueparent.utils.dto.MessageEntity;
import com.unlockestate.ueparent.utils.dto.UserDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/task")
@RestController
public class TaskController {

    private static final Logger logger = LoggerFactory.getLogger(TaskController.class);
    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/task")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<Task> getTask(@RequestParam String id) {
        try {
            return ResponseEntity.ok(taskService.getTask(id));
        } catch (InternalServerRuntimeException e) {
            logger.error("Could not get task with id {}",id);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/createTask")
    public ResponseEntity<Task> createTask(
            @RequestBody Task task
    ) {
        try {
            task = taskService.createTask(task);
            return ResponseEntity.ok(task);
        } catch (InternalServerRuntimeException e) {
            logger.error("Could not save task!");
            return ResponseEntity.internalServerError().build();
        }

    }

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    @PostMapping("/updateTask")
    public ResponseEntity<MessageEntity> updateTask(
            @RequestBody Task task
    ) {
        try {
            taskService.updateTaskStatus(task);
            return ResponseEntity.ok(new MessageEntity("Task status set succesfully to " + task.getStatus().name()));
        } catch (InternalServerRuntimeException e) {
            logger.error("Could not update task!");
            return ResponseEntity.internalServerError().build();
        }

    }

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    @PostMapping("/updateTaskChecklistItem/{taskId}")
    public ResponseEntity<MessageEntity> updateTaskChecklistItem(
            @RequestBody TaskCheckListItem taskCheckListItem,
            @PathVariable String taskId
    ) {
        try {
            taskService.updateTaskChecklistItem(taskCheckListItem, taskId);
            return ResponseEntity.ok(new MessageEntity("OK"));
        } catch (InternalServerRuntimeException e) {
            logger.error("Could not update task!");
            return ResponseEntity.internalServerError().build();
        }

    }

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    @PostMapping("/addComment")
    public ResponseEntity<Comment> addComment(
            @RequestBody Comment comment
    ) {
        try {
            return ResponseEntity.ok(taskService.addComment(comment));
        } catch (InternalServerRuntimeException e) {
            logger.error("Could not add comment!");
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/getComments")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<List<Comment>> getComments(@RequestParam String taskId) {
        try {
            return ResponseEntity.ok(taskService.getCommentByTaskId(taskId));
        } catch (InternalServerRuntimeException e) {
            logger.error("Could not get comments");
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/getAuthor")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<UserDto> getAuthor(@RequestParam String commentId) {
        try {
            return ResponseEntity.ok(taskService.getAuthorByCommentId(commentId));
        } catch (InternalServerRuntimeException e) {
            logger.error("Could not get author");
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/setStartTime")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<String> startTask(@RequestBody Task task) {

        try {
            if (task.getStartTime() != null) {
                taskService.setStartTime(task);
            }
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (InternalServerRuntimeException e) {
            logger.error("Could not set task starting time!");
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/addExpense")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<String> addExpense(@RequestBody Expense expense) {

        try {
            if (expense != null && expense.getAmount() != null) {
                expense = taskService.addExpense(expense);
            }
            return ResponseEntity.ok(expense.getId() + "");
        } catch (InternalServerRuntimeException e) {
            logger.error("Could not enter the expense!");
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/deleteExpense")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<String> deleteExpense(@RequestBody Expense expense) {

        try {
            if (expense != null) {
                taskService.deleteExpense(expense);
            }
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (InternalServerRuntimeException e) {
            logger.error("Could not enter the expense!");
            return ResponseEntity.internalServerError().build();
        }
    }


}
