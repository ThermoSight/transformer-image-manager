// package com.example.transformer_manager_backkend.repository;

// import com.example.transformer_manager_backkend.entity.Image;
// import org.springframework.data.jpa.repository.JpaRepository;

// public interface ImageRepository extends JpaRepository<Image, Long> {
// }

package com.example.transformer_manager_backkend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.transformer_manager_backkend.entity.Image;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
}