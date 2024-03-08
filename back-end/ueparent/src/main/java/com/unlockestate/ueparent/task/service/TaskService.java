package com.unlockestate.ueparent.task.service;

import com.unlockestate.ueparent.task.dto.CheckList;
import com.unlockestate.ueparent.task.dto.CheckListItem;
import com.unlockestate.ueparent.task.dto.Task;
import com.unlockestate.ueparent.task.dto.TaskCheckListItem;
import com.unlockestate.ueparent.task.repository.*;
import com.unlockestate.ueparent.user.dto.Role;
import com.unlockestate.ueparent.user.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final UserService userService;
    private final TaskRepository taskRepository;
    private final CheckListRepository checkListRepository;
    private final CheckListItemRepository checkListItemRepository;

    @Autowired
    public TaskService(UserService userService,
                       TaskRepository taskRepository,
                       CheckListRepository checkListRepository,
                       CheckListItemRepository checkListItemRepository) {
        this.userService = userService;
        this.taskRepository = taskRepository;
        this.checkListRepository = checkListRepository;
        this.checkListItemRepository = checkListItemRepository;
    }

    public List<Task> getTasks() {
        if (userService.hasRole(Role.ADMIN)) {
            return taskRepository.findAll();
        }
        return taskRepository.findByAssignee(userService.getPrincipalName()).get();
    }

    @Transactional
    public Task saveTask(Task task) {
        task.setActive(true);
        List<CheckList> taskCheckList = checkListRepository.findByRealEstateId(task.getRealEstate().getId()).get();
        List<Integer> checkListIds = taskCheckList.stream()
                .map(CheckList::getId)
                .toList();

        List<CheckListItem> checkListItems = checkListItemRepository.findByCheckListIdIn(checkListIds).get();
        List<TaskCheckListItem> taskCheckListItems = new LinkedList<>();
        for (CheckListItem checkListItem : checkListItems){
            taskCheckListItems.add(new TaskCheckListItem(task,checkListItem, Status.PENDING));
        }

        task.setTaskCheckListItems(taskCheckListItems);
        return taskRepository.save(task);
    }
}
