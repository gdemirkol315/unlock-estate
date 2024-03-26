package com.unlockestate.ueparent.task.service;

import com.unlockestate.ueparent.task.dto.Comment;
import com.unlockestate.ueparent.task.dto.CheckList;
import com.unlockestate.ueparent.task.dto.CheckListItem;
import com.unlockestate.ueparent.task.dto.Task;
import com.unlockestate.ueparent.task.dto.TaskCheckListItem;
import com.unlockestate.ueparent.task.repository.*;
import com.unlockestate.ueparent.user.dto.Role;
import com.unlockestate.ueparent.user.dto.User;
import com.unlockestate.ueparent.user.repository.UserRepository;
import com.unlockestate.ueparent.user.service.UserService;
import com.unlockestate.ueparent.utils.dto.UserDto;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final UserService userService;
    private final TaskRepository taskRepository;
    private final TaskCheckListItemRepository taskCheckListItemRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    @Autowired
    public TaskService(UserService userService,
                       TaskRepository taskRepository,
                       TaskCheckListItemRepository taskCheckListItemRepository, CommentRepository commentRepository, UserRepository userRepository) {
        this.userService = userService;
        this.taskRepository = taskRepository;
        this.taskCheckListItemRepository = taskCheckListItemRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
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
    public Task createTask(Task task) {
        User creator = new User();
        creator.setUserId(userService.getPrincipalUserId());
        task.setCreator(creator);

        task = taskRepository.save(task);

        for (CheckList checkList : task.getRealEstate().getCheckLists()) {
            for (CheckListItem checkListItem : checkList.getCheckListItems()) {
                TaskCheckListItem taskCheckListItem = new TaskCheckListItem(task, checkListItem, Status.PENDING);
                taskCheckListItemRepository.save(taskCheckListItem);
            }
        }

        return task;
    }

    @Transactional
    public void updateTaskStatus(Task task){
        taskRepository.setStatus(task.getStatus().name(), task.getId());
    }

    public Task getTask(String id) {
        return taskRepository.findById(Integer.parseInt(id)).get();
    }

    @Transactional
    public void updateTaskChecklistItem(TaskCheckListItem taskCheckListItem, String taskId) {
        taskCheckListItemRepository.setStatus(taskCheckListItem.getStatus().name(),
                Integer.parseInt(taskId),
                taskCheckListItem.getChecklistItem().getId());
    }

    public Comment addComment(Comment comment) {
        comment.setAuthor(userRepository.findByEmail(comment.getAuthor().getEmail()).get());
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentByTaskId(String taskId) {
        return commentRepository.findByTaskId(Integer.parseInt(taskId)).get();
    }

    @Transactional
    public UserDto getAuthorByCommentId(String commentId) {
        User user = commentRepository.findById(Integer.parseInt(commentId)).get().getAuthor();
        return new UserDto(user.getUserId(), user.getName(), user.getLastName());
    }
}
