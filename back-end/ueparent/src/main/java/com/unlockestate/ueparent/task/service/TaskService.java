package com.unlockestate.ueparent.task.service;

import com.unlockestate.ueparent.notification.dto.Email;
import com.unlockestate.ueparent.notification.service.EmailService;
import com.unlockestate.ueparent.notification.service.WhatsAppService;
import com.unlockestate.ueparent.task.dto.*;
import com.unlockestate.ueparent.task.repository.*;
import com.unlockestate.ueparent.user.dto.User;
import com.unlockestate.ueparent.user.repository.UserRepository;
import com.unlockestate.ueparent.user.service.UserService;
import com.unlockestate.ueparent.utils.dto.UserDto;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final ExpenseRepository expenseRepository;

    private final WhatsAppService whatsAppService;
    private final EmailService emailService;

    @Autowired
    public TaskService(UserService userService,
                       TaskRepository taskRepository,
                       TaskCheckListItemRepository taskCheckListItemRepository,
                       CommentRepository commentRepository,
                       UserRepository userRepository, ExpenseRepository expenseRepository,
                       WhatsAppService whatsAppService, EmailService emailService) {
        this.userService = userService;
        this.taskRepository = taskRepository;
        this.taskCheckListItemRepository = taskCheckListItemRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.expenseRepository = expenseRepository;
        this.whatsAppService = whatsAppService;
        this.emailService = emailService;
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

        User assignee = userRepository.findById(task.getAssignee().getUserId()).orElseThrow();
        whatsAppService.sendMessage(getTaskCreatedMessage(task), assignee.getPhoneNumber());

        return task;
    }

    @Transactional
    public void updateTaskStatus(Task task) {
        taskRepository.setStatus(task.getStatus().name(), task.getId());
        if (task.getStatus().equals(Status.SUBMITTED)
                || (task.getStatus().equals(Status.DONE)
                && task.getAssignee().getEmail().equals(SecurityContextHolder.getContext().getAuthentication().getName()))){
            taskRepository.setFinishTime(new Date(), task.getId());
        }
        commentRepository.save(getStatusUpdatedComment(task));
        Email email = new Email(task.getCreator().getEmail(),
                getTaskStatusChangeMessage(task),
                "Task " + task.getStatus().name() + " (" + task.getRealEstate().getName() + ")");
        emailService.sendSimpleMessage(email);

    }

    private Comment getStatusUpdatedComment(Task task) {
        Comment comment = new Comment();
        comment.setAuthor(userRepository.findByEmail(initialUser).orElseThrow());
        comment.setDate(new Date());
        comment.setTask(task);
        User statusChanger = userRepository.findByEmail(userService.getPrincipalName()).orElseThrow();
        comment.setContent("Task status set to " + task.getStatus().name() + " from " + statusChanger.getName() + " " + statusChanger.getLastName());
        return comment;
    }

    private String getTaskStatusChangeMessage(Task task) {
        String checkoutDateTime = formatDate(new Date(task.getTaskDate().getTime()));
        String taskCompleteDateTime = formatDate(new Date());
        User statusChanger = userRepository.findByEmail(userService.getPrincipalName()).orElseThrow();
        StringBuilder message = new StringBuilder("This is an automated message. Please do not reply." +
                "\n\n\nFollowing task status changed to " + task.getStatus()
                + " by " + statusChanger.getName() + " " + statusChanger.getLastName() +
                "\nTask Status Change Date: " + taskCompleteDateTime +
                "\nProperty: " + task.getRealEstate().getName() +
                "\nAssignee: " + task.getAssignee().getName() + " " + task.getAssignee().getLastName() +
                "\nCheckout Date: " + checkoutDateTime +
                " \n\nChecklist Items:\n");

        for (TaskCheckListItem taskCheckListItem : task.getTaskCheckListItems()) {
            message.append("\n - ")
                    .append(taskCheckListItem.getChecklistItem().getDescription())
                    .append(": ")
                    .append(taskCheckListItem.getStatus());
        }

        message.append("\n\nTask link: \n" + allowedOrigin + "/task-detail/" + task.getId());

        return message.toString();
    }

    public Task getTask(String id) {
        return taskRepository.findById(Integer.parseInt(id)).orElseThrow();
    }

    @Transactional
    public void updateTaskChecklistItem(TaskCheckListItem taskCheckListItem, String taskId) {
        taskCheckListItemRepository.setStatus(taskCheckListItem.getStatus().name(),
                Integer.parseInt(taskId),
                taskCheckListItem.getChecklistItem().getId());
    }

    public Comment addComment(Comment comment) {
        comment.setAuthor(userRepository.findByEmail(comment.getAuthor().getEmail()).orElseThrow());
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentByTaskId(String taskId) {
        return commentRepository.findByTaskId(Integer.parseInt(taskId)).orElseThrow();
    }

    @Transactional
    public UserDto getAuthorByCommentId(String commentId) {
        User user = commentRepository.findById(Integer.parseInt(commentId)).orElseThrow().getAuthor();
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

    public void setStartTime(Task dummyTask) {
        Date startTime = dummyTask.getStartTime();
        Task task = taskRepository.getReferenceById(dummyTask.getId());
        task.setStartTime(startTime);
        taskRepository.save(task);
    }

    public Expense addExpense(Expense expense) {
        expense.setAuthor(userRepository.findByEmail(expense.getAuthor().getEmail()).orElseThrow());
        expense.setTask(taskRepository.findById(expense.getTask().getId()).orElseThrow());
        return expenseRepository.save(expense);
    }

    public void deleteExpense(Expense expense) {
        expenseRepository.delete(expense);
    }

    public void createTasks(List<Task> tasks) {
        for (Task task: tasks){
            createTask(task);
        }
    }
}
