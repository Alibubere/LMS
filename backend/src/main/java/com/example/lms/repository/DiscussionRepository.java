package com.example.lms.repository;

import com.example.lms.entity.Discussion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiscussionRepository extends JpaRepository<Discussion, Long> {
    List<Discussion> findByCourseIdAndParentIsNullOrderByCreatedAtDesc(Long courseId);
    List<Discussion> findByParentIdOrderByCreatedAtAsc(Long parentId);
}
