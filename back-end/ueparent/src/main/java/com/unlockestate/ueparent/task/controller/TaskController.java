package com.unlockestate.ueparent.task.controller;

import com.unlockestate.ueparent.exception.InternalServerRuntimeException;
import com.unlockestate.ueparent.task.dto.Task;
import com.unlockestate.ueparent.task.service.TaskService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<List<Task>> allRealEstate() {
        try {
            return ResponseEntity.ok(taskService.getTasks());
        } catch (InternalServerRuntimeException e) {
            logger.error("Could not get real estates");
            return ResponseEntity.internalServerError().build();
        }
    }


}
