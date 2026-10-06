package com.example.lms.dto.response;

import com.example.lms.entity.Course;
import java.time.LocalDateTime;

public class CourseResponse {
    private Long id;
    private String title;
    private String description;
    private Long categoryId;
    private String categoryName;
    private Long instructorId;
    private String instructorName;
    private String status;
    private String thumbnailUrl;
    private Long totalLessons;
    private Long totalEnrolled;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CourseResponse() {}

    public static CourseResponse fromEntity(Course course) {
        return fromEntity(course, null, null);
    }

    public static CourseResponse fromEntity(Course course, Long totalLessons, Long totalEnrolled) {
        if (course == null) return null;
        CourseResponse res = new CourseResponse();
        res.setId(course.getId());
        res.setTitle(course.getTitle());
        res.setDescription(course.getDescription());
        if (course.getCategory() != null) {
            res.setCategoryId(course.getCategory().getId());
            res.setCategoryName(course.getCategory().getName());
        }
        if (course.getInstructor() != null) {
            res.setInstructorId(course.getInstructor().getId());
            res.setInstructorName(course.getInstructor().getName());
        }
        res.setStatus(course.getStatus().name());
        res.setThumbnailUrl(course.getThumbnailUrl());
        res.setTotalLessons(totalLessons != null ? totalLessons : 0L);
        res.setTotalEnrolled(totalEnrolled != null ? totalEnrolled : 0L);
        res.setCreatedAt(course.getCreatedAt());
        res.setUpdatedAt(course.getUpdatedAt());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Long getInstructorId() {
        return instructorId;
    }

    public void setInstructorId(Long instructorId) {
        this.instructorId = instructorId;
    }

    public String getInstructorName() {
        return instructorName;
    }

    public void setInstructorName(String instructorName) {
        this.instructorName = instructorName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public Long getTotalLessons() {
        return totalLessons;
    }

    public void setTotalLessons(Long totalLessons) {
        this.totalLessons = totalLessons;
    }

    public Long getTotalEnrolled() {
        return totalEnrolled;
    }

    public void setTotalEnrolled(Long totalEnrolled) {
        this.totalEnrolled = totalEnrolled;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
