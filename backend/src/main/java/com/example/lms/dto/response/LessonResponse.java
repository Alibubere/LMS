package com.example.lms.dto.response;

import com.example.lms.entity.Lesson;
import java.time.LocalDateTime;

public class LessonResponse {
    private Long id;
    private Long courseId;
    private String title;
    private String description;
    private String contentUrl;
    private String contentText;
    private Integer orderIndex;
    private Integer durationMinutes;
    private Boolean completed;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public LessonResponse() {}

    public static LessonResponse fromEntity(Lesson lesson) {
        return fromEntity(lesson, false);
    }

    public static LessonResponse fromEntity(Lesson lesson, Boolean completed) {
        if (lesson == null) return null;
        LessonResponse res = new LessonResponse();
        res.setId(lesson.getId());
        if (lesson.getCourse() != null) {
            res.setCourseId(lesson.getCourse().getId());
        }
        res.setTitle(lesson.getTitle());
        res.setDescription(lesson.getDescription());
        res.setContentUrl(lesson.getContentUrl());
        res.setContentText(lesson.getContentText());
        res.setOrderIndex(lesson.getOrderIndex());
        res.setDurationMinutes(lesson.getDurationMinutes());
        res.setCompleted(completed != null ? completed : false);
        res.setCreatedAt(lesson.getCreatedAt());
        res.setUpdatedAt(lesson.getUpdatedAt());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
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

    public String getContentUrl() {
        return contentUrl;
    }

    public void setContentUrl(String contentUrl) {
        this.contentUrl = contentUrl;
    }

    public String getContentText() {
        return contentText;
    }

    public void setContentText(String contentText) {
        this.contentText = contentText;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
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
