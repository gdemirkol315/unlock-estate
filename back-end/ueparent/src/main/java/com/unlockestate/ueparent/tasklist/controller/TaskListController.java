package com.unlockestate.ueparent.tasklist.controller;

import com.unlockestate.ueparent.exception.InternalServerRuntimeException;
import com.unlockestate.ueparent.realestate.dto.RealEstate;
import com.unlockestate.ueparent.task.controller.TaskController;

import com.unlockestate.ueparent.tasklist.service.TaskListService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

@RestController
public class TaskListController {

    private static final Logger logger = LoggerFactory.getLogger(TaskController.class);
    private static TaskListService taskListService;

    @Autowired
    public TaskListController(TaskListService taskListService) {
        this.taskListService = taskListService;
    }

    @GetMapping("/realEstate/checkOuts")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<RealEstate>> getTask(@RequestParam Date date) {
        try {
            return ResponseEntity.ok(taskListService.getRealEstateWithCheckOut(date));
        } catch (InternalServerRuntimeException e) {
            logger.error("Could not get checkouts for {}",date);
            return ResponseEntity.internalServerError().build();
        }
    }

}
