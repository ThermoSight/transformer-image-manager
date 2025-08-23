package com.example.transformer_manager_backkend.controller;

import com.example.transformer_manager_backkend.entity.Admin;
import com.example.transformer_manager_backkend.entity.Inspection;
import com.example.transformer_manager_backkend.repository.AdminRepository;
import com.example.transformer_manager_backkend.service.InspectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

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
            @RequestParam(value = "notes", required = false) String notes,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            Principal principal) throws IOException {

        Admin admin = adminRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Inspection inspection = inspectionService.createInspection(
                transformerRecordId, notes, images, admin);

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