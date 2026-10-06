package com.example.lms.repository;

import com.example.lms.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    Optional<Certificate> findByCertificateCode(String certificateCode);
    Optional<Certificate> findByUserIdAndCourseId(Long userId, Long courseId);
    List<Certificate> findByUserId(Long userId);
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
}
