package com.example.lms.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public class LessonUpdateRequest {

    @Size(min = 2, max = 255, message = "Title must be between 2 and 255 characters")
    private String title;

    private String description;

    private String contentUrl;

    private String contentText;

    @Min(value = 1, message = "Order index must be at least 1")
    private Integer orderIndex;

    @Min(value = 0, message = "Duration must be positive")
    private Integer durationMinutes;

    public LessonUpdateRequest() {}

    public LessonUpdateRequest(String title, String description, String contentUrl, String contentText, Integer orderIndex, Integer durationMinutes) {
        this.title = title;
        this.description = description;
        this.contentUrl = contentUrl;
        this.contentText = contentText;
        this.orderIndex = orderIndex;
        this.durationMinutes = durationMinutes;
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
}
