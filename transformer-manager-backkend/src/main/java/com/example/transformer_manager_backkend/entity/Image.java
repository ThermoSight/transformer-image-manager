package com.example.transformer_manager_backkend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "images")
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String filePath;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime uploadTime;

    @Column(nullable = false)
    private String type; // "Baseline" or "Maintenance"

    @Column
    private String weatherCondition; // Only for Baseline

    @ManyToOne
    @JoinColumn(name = "transformer_record_id") // Renamed column to reflect new entity name
    @JsonIgnoreProperties("images") // Prevent circular reference when serializing TransformerRecord
    private TransformerRecord transformerRecord;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public LocalDateTime getUploadTime() {
        return uploadTime;
    }

    public void setUploadTime(LocalDateTime uploadTime) {
        this.uploadTime = uploadTime;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getWeatherCondition() {
        return weatherCondition;
    }

    public void setWeatherCondition(String weatherCondition) {
        this.weatherCondition = weatherCondition;
    }

    public TransformerRecord getTransformerRecord() {
        return transformerRecord;
    }

    public void setTransformerRecord(TransformerRecord transformerRecord) {
        this.transformerRecord = transformerRecord;
    }
}
