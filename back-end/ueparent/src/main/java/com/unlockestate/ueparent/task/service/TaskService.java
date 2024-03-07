package com.unlockestate.ueparent.task.service;

import com.unlockestate.ueparent.task.dto.Task;
import com.unlockestate.ueparent.task.repository.TaskRepository;
import com.unlockestate.ueparent.user.dto.Role;
import com.unlockestate.ueparent.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private UserService userService;
    private TaskRepository taskRepository;

    @Autowired
    public TaskService(UserService userService, TaskRepository taskRepository) {
        this.userService = userService;
        this.taskRepository = taskRepository;
    }

    public List<Task> getTasks() {
        if (userService.hasRole(Role.ADMIN)) {
            return taskRepository.findAll();
        }
        return taskRepository.findByAssignee(userService.getPrincipalName()).get();
    }
}
