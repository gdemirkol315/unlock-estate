package com.unlockestate.ueparent.file.service;

import com.unlockestate.ueparent.file.repository.ImageRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

@Service
public class FileUploadService {

    private final ImageRepository imageRepository;

    @Autowired
    public FileUploadService(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    public void uploadCommentImage(MultipartFile file, String savePath, String imageId) throws IOException {
        uploadFile(file, savePath, imageId);
    }

    @Transactional
    private void uploadFile(MultipartFile file, String path, String imageId) throws IOException {

        String absolutePathPrefix = new File(".").getAbsolutePath() + File.separator;

        // Ensure the directories exist
        File directory = new File(absolutePathPrefix + path);
        if (!directory.exists() && !directory.mkdirs()) {
            throw new RuntimeException("Failed to create directory structure: " + directory);
        }

        // Save the file
        File dest = Paths.get(absolutePathPrefix + path, file.getOriginalFilename()).toFile();
        file.transferTo(dest);

        imageRepository.setLink(absolutePathPrefix + path + file.getOriginalFilename(), Integer.valueOf(imageId) );
    }
}
