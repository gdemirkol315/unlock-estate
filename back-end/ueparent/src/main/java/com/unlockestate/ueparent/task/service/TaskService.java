package com.unlockestate.ueparent.task.service;

import com.unlockestate.ueparent.task.dto.CheckList;
import com.unlockestate.ueparent.task.dto.CheckListItem;
import com.unlockestate.ueparent.task.dto.Task;
import com.unlockestate.ueparent.task.dto.TaskCheckListItem;
import com.unlockestate.ueparent.task.repository.*;
import com.unlockestate.ueparent.user.dto.Role;
import com.unlockestate.ueparent.user.dto.User;
import com.unlockestate.ueparent.user.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final UserService userService;
    private final TaskRepository taskRepository;
    private final TaskCheckListItemRepository taskCheckListItemRepository;

    @Autowired
    public TaskService(UserService userService,
                       TaskRepository taskRepository,
                       TaskCheckListItemRepository taskCheckListItemRepository) {
        this.userService = userService;
        this.taskRepository = taskRepository;
        this.taskCheckListItemRepository = taskCheckListItemRepository;
    }

    public List<Task> getTasks() {
        List<Task> tasks;

        if (userService.hasRole(Role.ADMIN)) {
            tasks = taskRepository.findAll();
        } else {
            tasks = taskRepository.findByAssignee(userService.getPrincipalName()).get();
        }
        for (Task task : tasks) {
            task.getAssignee().setPassword(null);
            task.getCreator().setPassword(null);
        }
        return tasks;
    }

    @Transactional
    public Task saveTask(Task task) {
        task.setActive(true);
        User creator = new User();
        creator.setUserId(userService.getPrincipalUserId());
        task.setCreator(creator);

        for (CheckList checkList : task.getRealEstate().getCheckLists()) {
            for (CheckListItem checkListItem : checkList.getCheckListItems()) {
                task.getTaskCheckListItems().add(new TaskCheckListItem(task, checkListItem, Status.PENDING));
            }
        }


        return taskRepository.save(task);
    }

    public Task getTask(String id) {
        return taskRepository.findById(Integer.parseInt(id)).get();
    }

    @Transactional
    public void updateTaskChecklistItem(TaskCheckListItem taskCheckListItem) {
        taskCheckListItemRepository.setStatus(taskCheckListItem.getStatus().name(), taskCheckListItem.getId());
    }
}
