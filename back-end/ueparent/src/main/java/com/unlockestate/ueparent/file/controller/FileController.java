package com.unlockestate.ueparent.file.controller;


import com.unlockestate.ueparent.file.repository.ImageRepository;
import com.unlockestate.ueparent.file.service.FileUploadService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/file")
public class FileController {

    private final FileUploadService fileUploadService;
    private static final Logger logger = LoggerFactory.getLogger(FileController.class);


    @Autowired
    public FileController(FileUploadService fileUploadService, ImageRepository imageRepository) {
        this.fileUploadService = fileUploadService;
    }

    @PostMapping("/uploadImage")
    public ResponseEntity<String> fileUpload(@RequestParam MultipartFile file,
                                             @RequestParam String savePath,
                                             @RequestParam String imageId) {
        try {
            fileUploadService.uploadCommentImage(file, savePath, imageId);
            return ResponseEntity.ok("Ok");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatusCode.valueOf(500)).body("An error occurred while saving image!");
        }
    }

}
