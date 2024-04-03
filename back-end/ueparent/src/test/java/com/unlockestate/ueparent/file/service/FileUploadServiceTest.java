package com.unlockestate.ueparent.file.service;

import com.unlockestate.ueparent.file.dto.Image;
import com.unlockestate.ueparent.file.exception.FileUploadException;
import com.unlockestate.ueparent.file.repository.ImageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


class FileUploadServiceTest {


    @Mock
    ImageRepository imageRepository;

    @Mock
    MultipartFileWrapper fileWrapper = new MultipartFileWrapper(new MockMultipartFile("file", "hello.png", "image/png", "some image".getBytes()));

    @InjectMocks
    FileUploadService fileUploadService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }


    @Test
    void shouldUploadCommentImage() throws IOException, FileUploadException {
        MockMultipartFile mockMultipartFile = new MockMultipartFile("file", "hello.png", "image/png", "some image".getBytes());

        when(fileWrapper.getMultipartFile()).thenReturn(mockMultipartFile);
        doNothing().when(fileWrapper).transferTo(any(File.class));
        doNothing().when(imageRepository).setLink(anyString(), anyInt());

        fileUploadService.uploadCommentImage(fileWrapper, "path/to/save", "1");

        verify(imageRepository, times(1)).setLink(anyString(), anyInt());
    }

    @Test
    void shouldReturnImagePath() {
        Integer imageId = 1;
        String expectedPath = "path/to/image.png";
        Image image = new Image();
        image.setId(imageId);
        image.setLink(expectedPath);

        when(imageRepository.findById(anyInt())).thenReturn(Optional.of(image));

        String actualPath = fileUploadService.getImagePath("" + imageId);

        assertEquals(expectedPath, actualPath);

    }

    @Test
    void shouldThrowImageNotFoundExceptionWhenImageNotFound() {
        String imageId = "1";

        when(imageRepository.findById(anyInt())).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> fileUploadService.getImagePath(imageId));
    }
}