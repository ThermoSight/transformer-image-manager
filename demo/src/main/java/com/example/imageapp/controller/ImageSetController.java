package com.example.imageapp.controller;

import com.example.imageapp.entity.Admin;
import com.example.imageapp.entity.ImageSet;
import com.example.imageapp.repository.AdminRepository;
import com.example.imageapp.service.ImageSetService;
import com.example.imageapp.service.ImageSetService.ImageDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/image-sets")
@CrossOrigin(origins = "http://localhost:3000")
public class ImageSetController {

    private final ImageSetService imageSetService;
    private final AdminRepository adminRepository;

    public ImageSetController(ImageSetService imageSetService, AdminRepository adminRepository) {
        this.imageSetService = imageSetService;
        this.adminRepository = adminRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ImageSet> uploadImageSet(
            @RequestParam("name") String name,
            @RequestParam("locationName") String locationName,
            @RequestParam("locationLat") Double locationLat,
            @RequestParam("locationLng") Double locationLng,
            @RequestParam("capacity") String capacity,
            @RequestParam("images") List<MultipartFile> images,
            @RequestParam("types") List<String> types,
            @RequestParam(value = "weatherConditions", required = false) List<String> weatherConditions,
            Principal principal) throws IOException {

        Admin admin = adminRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

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
                imageDTOs, admin);
        return ResponseEntity.ok(savedSet);
    }

    @GetMapping
    public ResponseEntity<List<ImageSet>> getAllImageSets() {
        return ResponseEntity.ok(imageSetService.getAllImageSets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImageSet> getImageSetById(@PathVariable Long id) {
        return ResponseEntity.ok(imageSetService.getImageSetById(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteImageSet(@PathVariable Long id) throws IOException {
        imageSetService.deleteImageSet(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/images/{imageId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteImage(@PathVariable Long imageId) throws IOException {
        imageSetService.deleteImage(imageId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ImageSet> updateImageSet(
            @PathVariable Long id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "locationName", required = false) String locationName,
            @RequestParam(value = "locationLat", required = false) Double locationLat,
            @RequestParam(value = "locationLng", required = false) Double locationLng,
            @RequestParam(value = "capacity", required = false) String capacity,
            @RequestParam(value = "images", required = false) MultipartFile[] images,
            @RequestParam(value = "types", required = false) String[] types,
            @RequestParam(value = "weatherConditions", required = false) String[] weatherConditions,
            Principal principal) throws IOException {

        Admin admin = adminRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        List<ImageDTO> imageDTOs = null;
        if (images != null && types != null && images.length > 0) {
            imageDTOs = new ArrayList<>();
            for (int i = 0; i < images.length; i++) {
                ImageDTO dto = new ImageDTO();
                dto.file = images[i];
                dto.type = types[i];
                dto.weatherCondition = (dto.type.equals("Baseline") && weatherConditions != null
                        && i < weatherConditions.length)
                                ? weatherConditions[i]
                                : null;
                imageDTOs.add(dto);
            }
        }

        ImageSet updatedSet = imageSetService.updateImageSet(id, name, locationName, locationLat, locationLng, capacity,
                imageDTOs, admin);
        return ResponseEntity.ok(updatedSet);
    }
}