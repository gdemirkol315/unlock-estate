package com.unlockestate.ueparent.task.service;

import com.unlockestate.ueparent.notification.dto.Email;
import com.unlockestate.ueparent.notification.service.EmailService;
import com.unlockestate.ueparent.notification.service.WhatsAppService;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Service
public class TaskService {

    @Value("${app.allowed-origin}")
    private String allowedOrigin;

    @Value("${initial.user}")
    private String initialUser;

    private final UserService userService;
    private final TaskRepository taskRepository;
    private final TaskCheckListItemRepository taskCheckListItemRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    private final WhatsAppService whatsAppService;
    private final EmailService emailService;

    @Autowired
    public TaskService(UserService userService,
                       TaskRepository taskRepository,
                       TaskCheckListItemRepository taskCheckListItemRepository,
                       CommentRepository commentRepository,
                       UserRepository userRepository,
                       WhatsAppService whatsAppService, EmailService emailService) {
        this.userService = userService;
        this.taskRepository = taskRepository;
        this.taskCheckListItemRepository = taskCheckListItemRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.whatsAppService = whatsAppService;
        this.emailService = emailService;
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
        task.setStatus(Status.PENDING);
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

        User assignee = userRepository.findById(task.getAssignee().getUserId()).get();
        whatsAppService.sendMessage(getTaskCreatedMessage(task), assignee.getPhoneNumber());

        return task;
    }

    @Transactional
    public void updateTaskStatus(Task task) {
        taskRepository.setStatus(task.getStatus().name(), task.getId());
        commentRepository.save(getStatusUpdatedComment(task));
        if (task.getStatus().equals(Status.SUBMITTED) || task.getStatus().equals(Status.DONE)) {
            Email email = new Email(task.getCreator().getEmail(),
                    getTaskSubmittedMessage(task),
                    "Task " + task.getStatus().name() + " (" + task.getRealEstate().getName() + ")" );
            emailService.sendSimpleMessage(email);
        }
    }

    private Comment getStatusUpdatedComment(Task task) {
        Comment comment = new Comment();
        comment.setAuthor(userRepository.findByEmail(initialUser).get());
        comment.setDate(new Date());
        comment.setTask(task);
        User statusChanger = userRepository.findByEmail(userService.getPrincipalName()).get();
        comment.setContent("Task status set to " + task.getStatus().name() + " from " + statusChanger.getName() + " " + statusChanger.getLastName());
        return comment;
    }

    private String getTaskSubmittedMessage(Task task) {
        String checkoutDateTime = formatDate(new Date(task.getTaskDate().getTime()));
        String taskCompleteDateTime = formatDate(new Date());
        StringBuilder message = new StringBuilder("This is an automated message." +
                "\n\n\nFollowing task is completed:\n" +
                "\nProperty: " + task.getRealEstate().getName() +
                "\nAssignee: " + task.getAssignee().getName() + " " + task.getAssignee().getLastName() +
                "\nCheckout Date: " + checkoutDateTime +
                "\nTask Complete Date: " + taskCompleteDateTime +
                " \n\nChecklist Items:\n");

        for (TaskCheckListItem taskCheckListItem : task.getTaskCheckListItems()) {
            message.append("\n - ")
                    .append(taskCheckListItem.getChecklistItem().getDescription())
                    .append(": ")
                    .append(taskCheckListItem.getStatus());
        }

        return message.toString();
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

    public String getTaskCreatedMessage(Task task) {
        return "You have received a new task\n " +
                "\nTask Date & Time:\n" + formatDate(task.getTaskDate()) + "\n"+
                "\nProperty:\n" + task.getRealEstate().getName() + "\n" +
                "\nAddress:\n" + task.getRealEstate().getAddress()+ "," + task.getRealEstate().getZipCode()+
                "," + task.getRealEstate().getCity() + "," + task.getRealEstate().getCountry() +"\n" +
                "\n\nTask link:\n" + allowedOrigin +"/task-detail/" + task.getId() ;
    }
    private String formatDate(Date date){
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm");
        return simpleDateFormat.format(date);
    }
}
