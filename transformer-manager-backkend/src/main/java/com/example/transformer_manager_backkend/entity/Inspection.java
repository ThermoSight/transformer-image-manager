package com.example.transformer_manager_backkend.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List; // Add this import

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "inspections")
public class Inspection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "transformer_record_id", nullable = false)
    @JsonIgnoreProperties({"inspections", "images"})
    private TransformerRecord transformerRecord;

    @OneToMany(mappedBy = "inspection", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"inspection", "transformerRecord"})
    private List<Image> images;

    @ManyToOne
    @JoinColumn(name = "conducted_by")
    private Admin conductedBy;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false) // Add this field
    private LocalDate inspectionDate;

    private String notes;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TransformerRecord getTransformerRecord() {
        return transformerRecord;
    }

    public void setTransformerRecord(TransformerRecord transformerRecord) {
        this.transformerRecord = transformerRecord;
    }

    public List<Image> getImages() {
        return images;
    }

    public void setImages(List<Image> images) {
        this.images = images;
    }

    public Admin getConductedBy() {
        return conductedBy;
    }

    public void setConductedBy(Admin conductedBy) {
        this.conductedBy = conductedBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDate getInspectionDate() { // Add getter
        return inspectionDate;
    }

    public void setInspectionDate(LocalDate inspectionDate) { // Add setter
        this.inspectionDate = inspectionDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}