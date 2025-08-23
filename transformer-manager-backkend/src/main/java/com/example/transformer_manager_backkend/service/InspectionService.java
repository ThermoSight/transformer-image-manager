
package com.example.transformer_manager_backkend.service;



import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.transformer_manager_backkend.entity.Admin;
import com.example.transformer_manager_backkend.entity.Image;
import com.example.transformer_manager_backkend.entity.Inspection;
import com.example.transformer_manager_backkend.entity.TransformerRecord; // Add this import
import com.example.transformer_manager_backkend.repository.InspectionRepository;
import com.example.transformer_manager_backkend.repository.TransformerRecordRepository;



@Service

public class InspectionService {



    private final InspectionRepository inspectionRepository;

    private final TransformerRecordRepository transformerRecordRepository;



    @Value("${upload.directory}")

    private String uploadDirectory;



    public InspectionService(InspectionRepository inspectionRepository,

            TransformerRecordRepository transformerRecordRepository) {

        this.inspectionRepository = inspectionRepository;

        this.transformerRecordRepository = transformerRecordRepository;

    }



    public Inspection createInspection(

            Long transformerRecordId,

            LocalDate inspectionDate, // Add this parameter

            String notes,

            List<MultipartFile> maintenanceImages,

            Admin conductedBy) throws IOException {



        TransformerRecord transformerRecord = transformerRecordRepository.findById(transformerRecordId)

                .orElseThrow(() -> new RuntimeException("Transformer record not found"));



        Inspection inspection = new Inspection();

        inspection.setTransformerRecord(transformerRecord);

        inspection.setConductedBy(conductedBy);

        inspection.setInspectionDate(inspectionDate); // Set the date

        inspection.setNotes(notes);



        List<Image> imageEntities = new ArrayList<>();

        if (maintenanceImages != null && !maintenanceImages.isEmpty()) {

            for (MultipartFile imageFile : maintenanceImages) {

                String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();

                Path uploadPath = Paths.get(uploadDirectory);

                if (!Files.exists(uploadPath))

                    Files.createDirectories(uploadPath);

                Path filePath = uploadPath.resolve(fileName);

                Files.copy(imageFile.getInputStream(), filePath);



                Image image = new Image();

                image.setFilePath("/uploads/" + fileName);

                image.setType("Maintenance");

                image.setInspection(inspection);



                imageEntities.add(image);

            }

        }



        inspection.setImages(imageEntities);

        return inspectionRepository.save(inspection);

    }
    public List<Inspection> getInspectionsByTransformerRecordId(Long transformerRecordId) {
        return inspectionRepository.findByTransformerRecordId(transformerRecordId);
    }

    public Inspection getInspectionById(Long id) {
        return inspectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inspection not found"));
    }

    public void deleteInspection(Long id) throws IOException {
        Inspection inspection = inspectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inspection not found"));

        // Delete associated images
        for (Image image : inspection.getImages()) {
            try {
                Path filePath = Paths.get(uploadDirectory, image.getFilePath().replace("/uploads/", ""));
                Files.deleteIfExists(filePath);
            } catch (Exception ignore) {
            }
        }

        inspectionRepository.deleteById(id);
    }
}