package com.example.lms.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class ProgressUpdateRequest {

    private Boolean completed;

    @Min(value = 0, message = "Watch time must be non-negative")
    private Integer watchTimeSeconds;

    @Min(value = 0, message = "Completion percentage cannot be negative")
    @Max(value = 100, message = "Completion percentage cannot exceed 100")
    private Double completionPercentage;

    public ProgressUpdateRequest() {}

    public ProgressUpdateRequest(Boolean completed, Integer watchTimeSeconds, Double completionPercentage) {
        this.completed = completed;
        this.watchTimeSeconds = watchTimeSeconds;
        this.completionPercentage = completionPercentage;
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
}
