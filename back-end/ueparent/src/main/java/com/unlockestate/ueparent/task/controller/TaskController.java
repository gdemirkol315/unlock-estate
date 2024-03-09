package com.unlockestate.ueparent.task.controller;

import com.unlockestate.ueparent.exception.InternalServerRuntimeException;
import com.unlockestate.ueparent.task.dto.Task;
import com.unlockestate.ueparent.task.service.TaskService;
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


}
