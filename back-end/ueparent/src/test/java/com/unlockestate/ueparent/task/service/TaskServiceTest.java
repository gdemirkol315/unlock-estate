package com.unlockestate.ueparent.task.service;

import com.unlockestate.ueparent.notification.dto.Email;
import com.unlockestate.ueparent.notification.service.EmailService;
import com.unlockestate.ueparent.notification.service.WhatsAppService;
import com.unlockestate.ueparent.realestate.dto.RealEstate;
import com.unlockestate.ueparent.task.dto.CheckListItem;
import com.unlockestate.ueparent.task.dto.Comment;
import com.unlockestate.ueparent.task.dto.Task;
import com.unlockestate.ueparent.task.dto.TaskCheckListItem;
import com.unlockestate.ueparent.task.repository.CommentRepository;
import com.unlockestate.ueparent.task.repository.Status;
import com.unlockestate.ueparent.task.repository.TaskRepository;
import com.unlockestate.ueparent.user.dto.Role;
import com.unlockestate.ueparent.user.dto.User;
import com.unlockestate.ueparent.user.repository.UserRepository;
import com.unlockestate.ueparent.user.service.UserService;
import org.hibernate.annotations.Check;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;
import java.util.Date;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserService userService;

    @Mock
    private EmailService emailService;

    @Mock
    private WhatsAppService whatsAppService;

    @InjectMocks
    private TaskService taskService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldCreateTaskSuccessfully() {
        Task task = new Task();
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        taskService.createTask(task);

        verify(taskRepository, times(1)).save(any(Task.class));
        verify(whatsAppService, times(1)).sendMessage(anyString(), anyString());
    }

    @Test
    void shouldUpdateTaskStatusSuccessfully() {
        Task task = new Task();
        task.setId(1);
        task.setStatus(Status.PENDING);
        task.setCreator(new User());
        task.setTaskDate(new Date());
        task.setRealEstate(new RealEstate());
        task.getRealEstate().setName("Test real estate");
        task.setAssignee(new User());
        task.getAssignee().setLastName("last name");
        task.getAssignee().setName("name");
        TaskCheckListItem taskCheckListItem = new TaskCheckListItem();
        taskCheckListItem.setTask(task);
        CheckListItem checkListItem = new CheckListItem();
        checkListItem.setId(1);
        checkListItem.setDescription("checklist item description");
        taskCheckListItem.setChecklistItem(checkListItem);
        task.setTaskCheckListItems(Collections.singletonList(taskCheckListItem));
        User initialUser = new User();
        initialUser.setRole(Role.ADMIN);
        initialUser.setEmail("initialUser");
        initialUser.setName("Some");
        initialUser.setLastName("User");
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(initialUser));
        when(userRepository.findByEmail(null)).thenReturn(Optional.of(initialUser));
        when(commentRepository.save(any(Comment.class))).thenReturn(new Comment());
        when(userService.getPrincipalName()).thenReturn("submitter");
        doNothing().when(emailService).sendSimpleMessage(any(Email.class));
        taskService.updateTaskStatus(task);

        verify(taskRepository, times(1)).setStatus(anyString(), anyInt());
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    @Test
    void shouldAddCommentSuccessfully() {
        Comment comment = new Comment();
        when(commentRepository.save(any(Comment.class))).thenReturn(comment);

        taskService.addComment(comment);

        verify(commentRepository, times(1)).save(any(Comment.class));
    }
}