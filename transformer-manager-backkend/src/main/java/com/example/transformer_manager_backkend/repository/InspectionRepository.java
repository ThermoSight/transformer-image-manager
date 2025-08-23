package com.example.transformer_manager_backkend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.transformer_manager_backkend.entity.Inspection;

public interface InspectionRepository extends JpaRepository<Inspection, Long> {
    List<Inspection> findByTransformerRecordId(Long transformerId);
}
