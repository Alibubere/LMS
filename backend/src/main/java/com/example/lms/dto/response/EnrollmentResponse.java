package com.example.lms.dto.response;

import com.example.lms.entity.Enrollment;
import java.time.LocalDateTime;

public class EnrollmentResponse {
    private Long id;
    private Long userId;
    private String userName;
    private Long courseId;
    private String courseTitle;
    private String status;
    private Double progressPercentage;
    private LocalDateTime enrolledAt;
    private LocalDateTime completedAt;

    public EnrollmentResponse() {}

    public static EnrollmentResponse fromEntity(Enrollment enrollment) {
        return fromEntity(enrollment, 0.0);
    }

    public static EnrollmentResponse fromEntity(Enrollment enrollment, Double progressPercentage) {
        if (enrollment == null) return null;
        EnrollmentResponse res = new EnrollmentResponse();
        res.setId(enrollment.getId());
        if (enrollment.getUser() != null) {
            res.setUserId(enrollment.getUser().getId());
            res.setUserName(enrollment.getUser().getName());
        }
        if (enrollment.getCourse() != null) {
            res.setCourseId(enrollment.getCourse().getId());
            res.setCourseTitle(enrollment.getCourse().getTitle());
        }
        res.setStatus(enrollment.getStatus().name());
        res.setProgressPercentage(progressPercentage != null ? progressPercentage : 0.0);
        res.setEnrolledAt(enrollment.getEnrolledAt());
        res.setCompletedAt(enrollment.getCompletedAt());
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

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(Double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public LocalDateTime getEnrolledAt() {
        return enrolledAt;
    }

    public void setEnrolledAt(LocalDateTime enrolledAt) {
        this.enrolledAt = enrolledAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
