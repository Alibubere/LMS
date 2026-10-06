package com.example.lms.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public class QuizCreateRequest {

    @NotBlank(message = "Quiz title is required")
    @Size(min = 2, max = 255, message = "Quiz title must be between 2 and 255 characters")
    private String title;

    private String description;

    @Min(value = 0, message = "Passing score must be at least 0")
    private Integer passingScore = 70;

    @Min(value = 1, message = "Time limit must be at least 1 minute")
    private Integer timeLimitMinutes = 30;

    private List<QuestionCreateRequest> questions;

    public QuizCreateRequest() {}

    public QuizCreateRequest(String title, String description, Integer passingScore, Integer timeLimitMinutes, List<QuestionCreateRequest> questions) {
        this.title = title;
        this.description = description;
        this.passingScore = passingScore;
        this.timeLimitMinutes = timeLimitMinutes;
        this.questions = questions;
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

    public List<QuestionCreateRequest> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionCreateRequest> questions) {
        this.questions = questions;
    }
}
