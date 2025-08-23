package com.example.transformer_manager_backkend.controller;

import com.example.transformer_manager_backkend.entity.Inspection;
import com.example.transformer_manager_backkend.entity.InspectionImage;
import com.example.transformer_manager_backkend.entity.TransformerRecord;
import com.example.transformer_manager_backkend.repository.InspectionRepository;
import com.example.transformer_manager_backkend.repository.InspectionImageRepository;
import com.example.transformer_manager_backkend.repository.TransformerRecordRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/inspections")
@CrossOrigin(origins = "http://localhost:3000") // adjust for frontend
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
                                       @RequestParam String description) {
        TransformerRecord transformer = transformerRecordRepository.findById(transformerId)
                .orElseThrow(() -> new RuntimeException("Transformer not found"));

        Inspection inspection = new Inspection();
        inspection.setDescription(description);
        inspection.setTransformerRecord(transformer);

        return inspectionRepository.save(inspection);
    }

    @GetMapping("/{transformerId}")
    public List<Inspection> getInspections(@PathVariable Long transformerId) {
        return inspectionRepository.findByTransformerRecordId(transformerId);
    }

    @PostMapping("/{id}/upload-image")
    public InspectionImage uploadImage(@PathVariable Long id,
                                       @RequestParam MultipartFile file) throws IOException {
        Inspection inspection = inspectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inspection not found"));

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        File dest = new File(uploadDir + "/" + filename);
        file.transferTo(dest);

        InspectionImage image = new InspectionImage();
        image.setImageUrl("/uploads/" + filename);
        image.setInspection(inspection);

        return inspectionImageRepository.save(image);
    }
}
