package com.unlockestate.ueparent.file.service;

import com.unlockestate.ueparent.file.exception.FileUploadException;
import com.unlockestate.ueparent.file.repository.ImageRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public void uploadCommentImage(MultipartFileWrapper file, String savePath, String imageId) throws IOException, FileUploadException {
        uploadFile(file, savePath, imageId);
    }

    @Transactional
    private void uploadFile(MultipartFileWrapper file, String path, String imageId) throws IOException, FileUploadException {

        String absolutePathPrefix = new File(".").getAbsolutePath() + File.separator;

        // Ensure the directories exist
        File directory = new File(absolutePathPrefix + path);
        if (!directory.exists() && !directory.mkdirs()) {
            throw new FileUploadException("Failed to create directory structure: " + directory);
        }

        // Save the file
        File dest = Paths.get(absolutePathPrefix + path, file.getMultipartFile().getOriginalFilename()).toFile();
        file.transferTo(dest);

        imageRepository.setLink(absolutePathPrefix + path + File.separator + file.getMultipartFile().getOriginalFilename(), Integer.valueOf(imageId) );
    }

    public String getImagePath(String imageId) {
        return imageRepository.findById(Integer.valueOf(imageId)).orElseThrow().getLink();
    }
}
