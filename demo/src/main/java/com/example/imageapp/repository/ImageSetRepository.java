package com.example.imageapp.repository;

import com.example.imageapp.entity.ImageSet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageSetRepository extends JpaRepository<ImageSet, Long> {
}