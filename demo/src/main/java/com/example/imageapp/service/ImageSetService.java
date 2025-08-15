package com.example.imageapp.service;

import com.example.imageapp.entity.Admin;
import com.example.imageapp.entity.Image;
import com.example.imageapp.entity.ImageSet;
import com.example.imageapp.repository.ImageSetRepository;
import com.example.imageapp.repository.ImageRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ImageSetService {

    private final ImageSetRepository imageSetRepository;
    private final ImageRepository imageRepository;

    @Value("${upload.directory}")
    private String uploadDirectory;

    public ImageSetService(ImageSetRepository imageSetRepository, ImageRepository imageRepository) {
        this.imageSetRepository = imageSetRepository;
        this.imageRepository = imageRepository;
    }

    public ImageSet saveImageSet(
            String name,
            String locationName,
            Double locationLat,
            Double locationLng,
            String capacity,
            List<ImageDTO> images,
            Admin uploadedBy) throws IOException {

        ImageSet imageSet = new ImageSet();
        imageSet.setName(name);
        imageSet.setLocationName(locationName);
        imageSet.setLocationLat(locationLat);
        imageSet.setLocationLng(locationLng);
        imageSet.setCapacity(capacity);
        imageSet.setUploadedBy(uploadedBy);

        List<Image> imageEntities = new ArrayList<>();
        for (ImageDTO imgDto : images) {
            String fileName = System.currentTimeMillis() + "_" + imgDto.file.getOriginalFilename();
            Path uploadPath = Paths.get(uploadDirectory);
            if (!Files.exists(uploadPath))
                Files.createDirectories(uploadPath);
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(imgDto.file.getInputStream(), filePath);

            Image image = new Image();
            image.setFilePath("/uploads/" + fileName);
            image.setType(imgDto.type);
            image.setWeatherCondition("Baseline".equals(imgDto.type) ? imgDto.weatherCondition : null);
            image.setImageSet(imageSet);

            imageEntities.add(image);
        }

        imageSet.setImages(imageEntities);
        return imageSetRepository.save(imageSet);
    }

    public List<ImageSet> getAllImageSets() {
        return imageSetRepository.findAll();
    }

    public ImageSet getImageSetById(Long id) {
        return imageSetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image set not found"));
    }

    public void deleteImageSet(Long id) throws IOException {
        ImageSet imageSet = imageSetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image set not found"));

        for (Image image : imageSet.getImages()) {
            try {
                Path filePath = Paths.get(uploadDirectory, image.getFilePath().replace("/uploads/", ""));
                Files.deleteIfExists(filePath);
            } catch (Exception ignore) {
            }
        }

        imageSetRepository.deleteById(id);
    }

    public void deleteImage(Long imageId) throws IOException {
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        try {
            Path filePath = Paths.get(uploadDirectory, image.getFilePath().replace("/uploads/", ""));
            Files.deleteIfExists(filePath);
        } catch (Exception ignore) {
        }

        imageRepository.deleteById(imageId);
    }

    public ImageSet updateImageSet(
            Long id,
            String name,
            String locationName,
            Double locationLat,
            Double locationLng,
            String capacity,
            List<ImageDTO> newImages,
            Admin updatedBy) throws IOException {

        ImageSet imageSet = imageSetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image set not found"));

        if (name != null)
            imageSet.setName(name);
        if (locationName != null)
            imageSet.setLocationName(locationName);
        if (locationLat != null)
            imageSet.setLocationLat(locationLat);
        if (locationLng != null)
            imageSet.setLocationLng(locationLng);
        if (capacity != null)
            imageSet.setCapacity(capacity);

        imageSet.setUploadedBy(updatedBy);

        if (newImages != null && !newImages.isEmpty()) {
            // Delete existing images and their files
            for (Image image : imageSet.getImages()) {
                try {
                    Path filePath = Paths.get(uploadDirectory, image.getFilePath().replace("/uploads/", ""));
                    Files.deleteIfExists(filePath);
                } catch (Exception ignore) {
                }
                imageRepository.delete(image);
            }

            // Add new images
            List<Image> imageEntities = new ArrayList<>();
            for (ImageDTO imgDto : newImages) {
                String fileName = System.currentTimeMillis() + "_" + imgDto.file.getOriginalFilename();
                Path uploadPath = Paths.get(uploadDirectory);
                if (!Files.exists(uploadPath))
                    Files.createDirectories(uploadPath);
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(imgDto.file.getInputStream(), filePath);

                Image image = new Image();
                image.setFilePath("/uploads/" + fileName);
                image.setType(imgDto.type);
                image.setWeatherCondition("Baseline".equals(imgDto.type) ? imgDto.weatherCondition : null);
                image.setImageSet(imageSet);

                imageEntities.add(image);
            }

            imageSet.setImages(imageEntities);
        }

        return imageSetRepository.save(imageSet);
    }

    public static class ImageDTO {
        public MultipartFile file;
        public String type;
        public String weatherCondition;
    }
}