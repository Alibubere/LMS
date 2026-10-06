package com.example.lms.dto.response;

import java.util.List;

public class CourseProgressResponse {
    private Long courseId;
    private Long userId;
    private Long completedLessons;
    private Long totalLessons;
    private Double overallProgressPercentage;
    private Boolean courseCompleted;
    private List<ProgressResponse> lessonProgress;

    public CourseProgressResponse() {}

    public CourseProgressResponse(Long courseId, Long userId, Long completedLessons, Long totalLessons, Double overallProgressPercentage, Boolean courseCompleted, List<ProgressResponse> lessonProgress) {
        this.courseId = courseId;
        this.userId = userId;
        this.completedLessons = completedLessons;
        this.totalLessons = totalLessons;
        this.overallProgressPercentage = overallProgressPercentage;
        this.courseCompleted = courseCompleted;
        this.lessonProgress = lessonProgress;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getCompletedLessons() {
        return completedLessons;
    }

    public void setCompletedLessons(Long completedLessons) {
        this.completedLessons = completedLessons;
    }

    public Long getTotalLessons() {
        return totalLessons;
    }

    public void setTotalLessons(Long totalLessons) {
        this.totalLessons = totalLessons;
    }

    public Double getOverallProgressPercentage() {
        return overallProgressPercentage;
    }

    public void setOverallProgressPercentage(Double overallProgressPercentage) {
        this.overallProgressPercentage = overallProgressPercentage;
    }

    public Boolean getCourseCompleted() {
        return courseCompleted;
    }

    public void setCourseCompleted(Boolean courseCompleted) {
        this.courseCompleted = courseCompleted;
    }

    public List<ProgressResponse> getLessonProgress() {
        return lessonProgress;
    }

    public void setLessonProgress(List<ProgressResponse> lessonProgress) {
        this.lessonProgress = lessonProgress;
    }
}
