package com.example.transformer_manager_backkend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.transformer_manager_backkend.entity.InspectionImage;

public interface InspectionImageRepository extends JpaRepository<InspectionImage, Long> {
}
