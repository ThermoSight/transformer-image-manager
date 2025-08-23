package com.example.transformer_manager_backkend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.transformer_manager_backkend.entity.Inspection;

@Repository
public interface InspectionRepository extends JpaRepository<Inspection, Long> {
    List<Inspection> findByTransformerRecordId(Long transformerId);
    
    // Add this method to fetch inspection with images
    @Query("SELECT i FROM Inspection i LEFT JOIN FETCH i.images WHERE i.id = :id")
    Optional<Inspection> findByIdWithImages(@Param("id") Long id);
}