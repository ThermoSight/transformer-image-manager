package com.example.imageapp.service;

import com.example.imageapp.entity.Image;
import com.example.imageapp.repository.ImageRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ImageService {

    private final ImageRepository imageRepository;

    @Value("${upload.directory}")
    private String uploadDirectory;

    public ImageService(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    public Image saveImage(String name, MultipartFile file) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDirectory);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Save file to filesystem
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        // Save metadata to database
        Image image = new Image();
        image.setName(name);
        image.setFilePath("/uploads/" + fileName);

        return imageRepository.save(image);
    }

    public List<Image> getAllImages() {
        return imageRepository.findAll();
    }

    public Image updateImage(Long id, String name, MultipartFile file) throws IOException {
        Image existingImage = imageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        // Update name if provided
        if (name != null && !name.isEmpty()) {
            existingImage.setName(name);
        }

        // Update file if provided
        if (file != null && !file.isEmpty()) {
            // Delete old file
            Files.deleteIfExists(Paths.get(existingImage.getFilePath()));

            // Save new file
            Path uploadPath = Paths.get(uploadDirectory);
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            existingImage.setFilePath(filePath.toString());
        }

        return imageRepository.save(existingImage);
    }
}