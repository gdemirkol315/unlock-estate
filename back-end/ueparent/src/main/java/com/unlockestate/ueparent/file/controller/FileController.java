package com.unlockestate.ueparent.file.controller;


import com.unlockestate.ueparent.file.repository.ImageRepository;
import com.unlockestate.ueparent.file.service.FileUploadService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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


    @GetMapping("/retrieveImage")
    public ResponseEntity<Resource> retrieveImage(@RequestParam String imageId) {
        try {

            Resource resource = new UrlResource("file:" + fileUploadService.getImagePath(imageId));

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                // Handle file not found, possibly throw an exception or return a 404
            }
        } catch (Exception e) {
            // Handle exceptions, possibly throw a custom exception or return an error response
        }
        return ResponseEntity.badRequest().build(); // Fallback response, adjust as necessary
    }

}