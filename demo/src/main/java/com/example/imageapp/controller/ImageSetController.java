package com.example.imageapp.controller;

import com.example.imageapp.entity.ImageSet;
import com.example.imageapp.service.ImageSetService;
import com.example.imageapp.service.ImageSetService.ImageDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/image-sets")
@CrossOrigin(origins = "http://localhost:3000")
public class ImageSetController {

    private final ImageSetService imageSetService;

    public ImageSetController(ImageSetService imageSetService) {
        this.imageSetService = imageSetService;
    }

    @PostMapping
    public ResponseEntity<ImageSet> uploadImageSet(
            @RequestParam("name") String name,
            @RequestParam("locationName") String locationName,
            @RequestParam("locationLat") Double locationLat,
            @RequestParam("locationLng") Double locationLng,
            @RequestParam("capacity") String capacity,
            @RequestParam("images") List<MultipartFile> images,
            @RequestParam("types") List<String> types,
            @RequestParam(value = "weatherConditions", required = false) List<String> weatherConditions)
            throws IOException {

        List<ImageDTO> imageDTOs = new ArrayList<>();
        for (int i = 0; i < images.size(); i++) {
            ImageDTO dto = new ImageDTO();
            dto.file = images.get(i);
            dto.type = types.get(i);
            dto.weatherCondition = (dto.type.equals("Baseline") && weatherConditions != null)
                    ? weatherConditions.get(i)
                    : null;
            imageDTOs.add(dto);
        }

        ImageSet savedSet = imageSetService.saveImageSet(name, locationName, locationLat, locationLng, capacity,
                imageDTOs);
        return ResponseEntity.ok(savedSet);
    }

    @GetMapping
    public ResponseEntity<List<ImageSet>> getAllImageSets() {
        return ResponseEntity.ok(imageSetService.getAllImageSets());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteImageSet(@PathVariable Long id) throws IOException {
        imageSetService.deleteImageSet(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<?> deleteImage(@PathVariable Long imageId) throws IOException {
        imageSetService.deleteImage(imageId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ImageSet> updateImageSet(
            @PathVariable Long id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "locationName", required = false) String locationName,
            @RequestParam(value = "locationLat", required = false) Double locationLat,
            @RequestParam(value = "locationLng", required = false) Double locationLng,
            @RequestParam(value = "capacity", required = false) String capacity,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @RequestParam(value = "types", required = false) List<String> types,
            @RequestParam(value = "weatherConditions", required = false) List<String> weatherConditions)
            throws IOException {

        List<ImageDTO> imageDTOs = null;
        if (images != null && types != null) {
            imageDTOs = new ArrayList<>();
            for (int i = 0; i < images.size(); i++) {
                ImageDTO dto = new ImageDTO();
                dto.file = images.get(i);
                dto.type = types.get(i);
                dto.weatherCondition = (dto.type.equals("Baseline") && weatherConditions != null)
                        ? weatherConditions.get(i)
                        : null;
                imageDTOs.add(dto);
            }
        }

        ImageSet updatedSet = imageSetService.updateImageSet(id, name, locationName, locationLat, locationLng, capacity,
                imageDTOs);
        return ResponseEntity.ok(updatedSet);
    }
}
