package com.example.lms.dto.response;

import com.example.lms.entity.Discussion;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class DiscussionResponse {
    private Long id;
    private Long courseId;
    private Long userId;
    private String userName;
    private String userRole;
    private String userAvatarUrl;
    private Long parentId;
    private String title;
    private String content;
    private List<DiscussionResponse> replies;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public DiscussionResponse() {}

    public static DiscussionResponse fromEntity(Discussion discussion) {
        if (discussion == null) return null;
        DiscussionResponse res = new DiscussionResponse();
        res.setId(discussion.getId());
        if (discussion.getCourse() != null) res.setCourseId(discussion.getCourse().getId());
        if (discussion.getUser() != null) {
            res.setUserId(discussion.getUser().getId());
            res.setUserName(discussion.getUser().getName());
            res.setUserRole(discussion.getUser().getRole().name());
            res.setUserAvatarUrl(discussion.getUser().getAvatarUrl());
        }
        if (discussion.getParent() != null) {
            res.setParentId(discussion.getParent().getId());
        }
        res.setTitle(discussion.getTitle());
        res.setContent(discussion.getContent());
        res.setCreatedAt(discussion.getCreatedAt());
        res.setUpdatedAt(discussion.getUpdatedAt());

        if (discussion.getReplies() != null && !discussion.getReplies().isEmpty()) {
            res.setReplies(discussion.getReplies().stream()
                .map(DiscussionResponse::fromEntity)
                .collect(Collectors.toList()));
        }
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

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public String getUserAvatarUrl() {
        return userAvatarUrl;
    }

    public void setUserAvatarUrl(String userAvatarUrl) {
        this.userAvatarUrl = userAvatarUrl;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<DiscussionResponse> getReplies() {
        return replies;
    }

    public void setReplies(List<DiscussionResponse> replies) {
        this.replies = replies;
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
