package com.example.transformer_manager_backkend.entity;

import java.time.LocalDate; // Add this import
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Inspection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    
    private LocalDate inspectionDate; // Add this field

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "transformer_id")
    private TransformerRecord transformerRecord;

    @OneToMany(mappedBy = "inspection", cascade = CascadeType.ALL)
    private List<InspectionImage> images;

    // ✅ Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getInspectionDate() { // Add getter
        return inspectionDate;
    }

    public void setInspectionDate(LocalDate inspectionDate) { // Add setter
        this.inspectionDate = inspectionDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public TransformerRecord getTransformerRecord() {
        return transformerRecord;
    }

    public void setTransformerRecord(TransformerRecord transformerRecord) {
        this.transformerRecord = transformerRecord;
    }

    public List<InspectionImage> getImages() {
        return images;
    }

    public void setImages(List<InspectionImage> images) {
        this.images = images;
    }
}