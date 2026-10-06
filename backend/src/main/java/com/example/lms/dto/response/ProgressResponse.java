package com.example.lms.dto.response;

import com.example.lms.entity.Progress;
import java.time.LocalDateTime;

public class ProgressResponse {
    private Long id;
    private Long userId;
    private Long courseId;
    private Long lessonId;
    private String lessonTitle;
    private Boolean completed;
    private Integer watchTimeSeconds;
    private Double completionPercentage;
    private LocalDateTime updatedAt;

    public ProgressResponse() {}

    public static ProgressResponse fromEntity(Progress progress) {
        if (progress == null) return null;
        ProgressResponse res = new ProgressResponse();
        res.setId(progress.getId());
        if (progress.getUser() != null) res.setUserId(progress.getUser().getId());
        if (progress.getCourse() != null) res.setCourseId(progress.getCourse().getId());
        if (progress.getLesson() != null) {
            res.setLessonId(progress.getLesson().getId());
            res.setLessonTitle(progress.getLesson().getTitle());
        }
        res.setCompleted(progress.getCompleted());
        res.setWatchTimeSeconds(progress.getWatchTimeSeconds());
        res.setCompletionPercentage(progress.getCompletionPercentage());
        res.setUpdatedAt(progress.getUpdatedAt());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public Long getLessonId() {
        return lessonId;
    }

    public void setLessonId(Long lessonId) {
        this.lessonId = lessonId;
    }

    public String getLessonTitle() {
        return lessonTitle;
    }

    public void setLessonTitle(String lessonTitle) {
        this.lessonTitle = lessonTitle;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public Integer getWatchTimeSeconds() {
        return watchTimeSeconds;
    }

    public void setWatchTimeSeconds(Integer watchTimeSeconds) {
        this.watchTimeSeconds = watchTimeSeconds;
    }

    public Double getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(Double completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
