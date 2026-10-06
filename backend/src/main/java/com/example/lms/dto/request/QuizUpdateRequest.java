package com.example.lms.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public class QuizUpdateRequest {

    @Size(min = 2, max = 255, message = "Quiz title must be between 2 and 255 characters")
    private String title;

    private String description;

    @Min(value = 0, message = "Passing score must be at least 0")
    private Integer passingScore;

    @Min(value = 1, message = "Time limit must be at least 1 minute")
    private Integer timeLimitMinutes;

    public QuizUpdateRequest() {}

    public QuizUpdateRequest(String title, String description, Integer passingScore, Integer timeLimitMinutes) {
        this.title = title;
        this.description = description;
        this.passingScore = passingScore;
        this.timeLimitMinutes = timeLimitMinutes;
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

    public Integer getPassingScore() {
        return passingScore;
    }

    public void setPassingScore(Integer passingScore) {
        this.passingScore = passingScore;
    }

    public Integer getTimeLimitMinutes() {
        return timeLimitMinutes;
    }

    public void setTimeLimitMinutes(Integer timeLimitMinutes) {
        this.timeLimitMinutes = timeLimitMinutes;
    }
}
