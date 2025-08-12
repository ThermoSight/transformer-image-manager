package com.example.imageapp.controller;

import com.example.imageapp.entity.Image;
import com.example.imageapp.service.ImageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend to access
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping
    public ResponseEntity<Image> uploadImage(
            @RequestParam("name") String name,
            @RequestParam("file") MultipartFile file) throws IOException {
        Image savedImage = imageService.saveImage(name, file);
        return ResponseEntity.ok(savedImage);
    }

    @GetMapping
    public ResponseEntity<List<Image>> getAllImages() {
        List<Image> images = imageService.getAllImages();
        return ResponseEntity.ok(images);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Image> updateImage(
            @PathVariable Long id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
        Image updatedImage = imageService.updateImage(id, name, file);
        return ResponseEntity.ok(updatedImage);
    }
}