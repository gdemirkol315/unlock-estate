package com.unlockestate.ueparent.file.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

public class MultipartFileWrapper {
    private final MultipartFile multipartFile;

    public MultipartFileWrapper(MultipartFile multipartFile) {
        this.multipartFile = multipartFile;
    }

    public void transferTo(File dest) throws IOException {
        multipartFile.transferTo(dest);
    }

    public MultipartFile getMultipartFile() {
        return multipartFile;
    }
}