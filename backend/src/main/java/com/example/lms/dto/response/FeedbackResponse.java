package com.example.lms.dto.response;

import com.example.lms.entity.Feedback;
import java.time.LocalDateTime;

public class FeedbackResponse {
    private Long id;
    private Long courseId;
    private Long userId;
    private String userName;
    private String userAvatarUrl;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public FeedbackResponse() {}

    public static FeedbackResponse fromEntity(Feedback feedback) {
        if (feedback == null) return null;
        FeedbackResponse res = new FeedbackResponse();
        res.setId(feedback.getId());
        if (feedback.getCourse() != null) res.setCourseId(feedback.getCourse().getId());
        if (feedback.getUser() != null) {
            res.setUserId(feedback.getUser().getId());
            res.setUserName(feedback.getUser().getName());
            res.setUserAvatarUrl(feedback.getUser().getAvatarUrl());
        }
        res.setRating(feedback.getRating());
        res.setComment(feedback.getComment());
        res.setCreatedAt(feedback.getCreatedAt());
        res.setUpdatedAt(feedback.getUpdatedAt());
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

    public String getUserAvatarUrl() {
        return userAvatarUrl;
    }

    public void setUserAvatarUrl(String userAvatarUrl) {
        this.userAvatarUrl = userAvatarUrl;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
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
