package com.unlockestate.ueparent.task.service;

import com.unlockestate.ueparent.notification.dto.Email;
import com.unlockestate.ueparent.notification.service.EmailService;
import com.unlockestate.ueparent.notification.service.WhatsAppService;
import com.unlockestate.ueparent.realestate.dto.RealEstate;
import com.unlockestate.ueparent.task.dto.*;
import com.unlockestate.ueparent.task.repository.CommentRepository;
import com.unlockestate.ueparent.task.repository.Status;
import com.unlockestate.ueparent.task.repository.TaskCheckListItemRepository;
import com.unlockestate.ueparent.task.repository.TaskRepository;
import com.unlockestate.ueparent.user.dto.Role;
import com.unlockestate.ueparent.user.dto.User;
import com.unlockestate.ueparent.user.repository.UserRepository;
import com.unlockestate.ueparent.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;


    @Mock
    private TaskCheckListItemRepository taskCheckListItemRepository;

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

    private Task task = new Task();
    private User initialUser = new User();

    @BeforeEach
    void setUp() {
        initiateParams();
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldCreateTaskSuccessfully() {

        when(taskRepository.save(any(Task.class))).thenReturn(task);
        when(taskCheckListItemRepository.save(any(TaskCheckListItem.class))).thenReturn(new TaskCheckListItem());
        when(userRepository.findById(anyInt())).thenReturn(Optional.of(task.getAssignee()));
        doNothing().when(whatsAppService).sendMessage(anyString(),anyString());
        taskService.createTask(task);

        verify(taskRepository, times(1)).save(any(Task.class));
        verify(taskCheckListItemRepository, times(1)).save(any(TaskCheckListItem.class));
    }

    @Test
    void shouldUpdateTaskStatusSuccessfully() {
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

    private void initiateParams() {
        CheckList checkList = new CheckList();
        List<CheckList> checkLists = new ArrayList<>();
        TaskCheckListItem taskCheckListItem = new TaskCheckListItem();
        CheckListItem checkListItem = new CheckListItem();
        List<CheckListItem> checkListItems = new ArrayList<>();
        checkListItem.setId(1);
        checkListItem.setDescription("checklist item description");
        checkListItems.add(checkListItem);
        task.setId(1);
        task.setStatus(Status.PENDING);
        task.setCreator(new User());
        task.setTaskDate(new Date());
        checkLists.add(checkList);
        RealEstate realEstate = new RealEstate();
        realEstate.setCheckLists(checkLists);
        task.setRealEstate(realEstate);
        task.getRealEstate().setName("Test real estate");
        task.setAssignee(new User());
        task.getAssignee().setLastName("last name");
        task.getAssignee().setName("name");
        task.getAssignee().setUserId(1);
        taskCheckListItem.setTask(task);
        taskCheckListItem.setChecklistItem(checkListItem);
        checkList.setCheckListItems(checkListItems);
        task.setTaskCheckListItems(Collections.singletonList(taskCheckListItem));

        initialUser.setRole(Role.ADMIN);
        initialUser.setEmail("initialUser");
        initialUser.setName("Some");
        initialUser.setLastName("User");
    }
}