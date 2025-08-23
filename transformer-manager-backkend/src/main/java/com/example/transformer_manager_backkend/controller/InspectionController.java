package com.example.transformer_manager_backkend.controller;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.transformer_manager_backkend.entity.Inspection;
import com.example.transformer_manager_backkend.entity.InspectionImage;
import com.example.transformer_manager_backkend.entity.TransformerRecord;
import com.example.transformer_manager_backkend.repository.InspectionImageRepository;
import com.example.transformer_manager_backkend.repository.InspectionRepository;
import com.example.transformer_manager_backkend.repository.TransformerRecordRepository;

@RestController
@RequestMapping("/api/inspections")
@CrossOrigin(origins = "http://localhost:3000")
public class InspectionController {

    private final InspectionRepository inspectionRepository;
    private final InspectionImageRepository inspectionImageRepository;
    private final TransformerRecordRepository transformerRecordRepository;

    @Value("${upload.directory}")
    private String uploadDir;

    public InspectionController(InspectionRepository inspectionRepository,
                                InspectionImageRepository inspectionImageRepository,
                                TransformerRecordRepository transformerRecordRepository) {
        this.inspectionRepository = inspectionRepository;
        this.inspectionImageRepository = inspectionImageRepository;
        this.transformerRecordRepository = transformerRecordRepository;
    }

    @PostMapping
    public Inspection createInspection(@RequestParam Long transformerId,
                                       @RequestParam String description,
                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inspectionDate) {
        TransformerRecord transformer = transformerRecordRepository.findById(transformerId)
                .orElseThrow(() -> new RuntimeException("Transformer not found"));

        Inspection inspection = new Inspection();
        inspection.setDescription(description);
        inspection.setInspectionDate(inspectionDate);
        inspection.setTransformerRecord(transformer);

        return inspectionRepository.save(inspection);
    }

    @GetMapping("/{transformerId}")
    public List<Inspection> getInspections(@PathVariable Long transformerId) {
        return inspectionRepository.findByTransformerRecordId(transformerId);
    }

    // Update this method in your InspectionController.java
    @GetMapping("/detail/{id}")
    public Inspection getInspectionWithImages(@PathVariable Long id) {
        return inspectionRepository.findByIdWithImages(id)
                .orElseThrow(() -> new RuntimeException("Inspection not found"));
    }

@PostMapping("/{id}/upload-image")
public InspectionImage uploadImage(@PathVariable Long id,
                                   @RequestParam MultipartFile file) throws IOException {
    Inspection inspection = inspectionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Inspection not found"));

    // Create the upload directory if it doesn't exist
    File uploadDirectory = new File(uploadDir);
    if (!uploadDirectory.exists()) {
        uploadDirectory.mkdirs(); // Create directory and parent directories
    }

    String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
    File dest = new File(uploadDirectory, filename); // Use proper path construction
    file.transferTo(dest);

    InspectionImage image = new InspectionImage();
    image.setImageUrl("/uploads/" + filename);
    image.setInspection(inspection);

    return inspectionImageRepository.save(image);
}
}