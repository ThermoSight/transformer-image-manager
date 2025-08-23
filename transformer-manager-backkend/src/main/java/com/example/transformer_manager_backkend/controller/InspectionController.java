package com.example.transformer_manager_backkend.controller;



import java.io.IOException;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat; // Add this import
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping; // Add this import
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.transformer_manager_backkend.entity.Admin;
import com.example.transformer_manager_backkend.entity.Inspection;
import com.example.transformer_manager_backkend.repository.AdminRepository;
import com.example.transformer_manager_backkend.service.InspectionService;



@RestController

@RequestMapping("/api/inspections")

@CrossOrigin(origins = "http://localhost:3000")

public class InspectionController {



    private final InspectionService inspectionService;

    private final AdminRepository adminRepository;



    public InspectionController(InspectionService inspectionService,

            AdminRepository adminRepository) {

        this.inspectionService = inspectionService;

        this.adminRepository = adminRepository;

    }



    @PostMapping

    @PreAuthorize("hasRole('ADMIN')")

    public ResponseEntity<Inspection> createInspection(

            @RequestParam("transformerRecordId") Long transformerRecordId,

            @RequestParam("inspectionDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inspectionDate, // Add this parameter

            @RequestParam(value = "notes", required = false) String notes,

            @RequestParam(value = "images", required = false) List<MultipartFile> images,

            Principal principal) throws IOException {



        Admin admin = adminRepository.findByUsername(principal.getName())

                .orElseThrow(() -> new RuntimeException("Admin not found"));



        Inspection inspection = inspectionService.createInspection(

                transformerRecordId, inspectionDate, notes, images, admin); // Pass the date



        return ResponseEntity.ok(inspection);

    }


    @GetMapping("/transformer/{transformerRecordId}")
    public ResponseEntity<List<Inspection>> getInspectionsByTransformerRecord(
            @PathVariable Long transformerRecordId) {
        return ResponseEntity.ok(inspectionService.getInspectionsByTransformerRecordId(transformerRecordId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inspection> getInspectionById(@PathVariable Long id) {
        return ResponseEntity.ok(inspectionService.getInspectionById(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteInspection(@PathVariable Long id) throws IOException {
        inspectionService.deleteInspection(id);
        return ResponseEntity.ok().build();
    }
}