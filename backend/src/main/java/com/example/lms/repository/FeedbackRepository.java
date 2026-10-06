package com.example.lms.repository;

import com.example.lms.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByCourseIdOrderByCreatedAtDesc(Long courseId);
    Optional<Feedback> findByUserIdAndCourseId(Long userId, Long courseId);
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
}
