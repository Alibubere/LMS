package com.example.lms.dto.response;

import com.example.lms.entity.Quiz;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class QuizResponse {
    private Long id;
    private Long courseId;
    private String courseTitle;
    private String title;
    private String description;
    private Integer passingScore;
    private Integer timeLimitMinutes;
    private Integer totalQuestions;
    private Integer totalPoints;
    private List<QuestionResponse> questions;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public QuizResponse() {}

    public static QuizResponse fromEntity(Quiz quiz, boolean includeAnswers) {
        if (quiz == null) return null;
        QuizResponse res = new QuizResponse();
        res.setId(quiz.getId());
        if (quiz.getCourse() != null) {
            res.setCourseId(quiz.getCourse().getId());
            res.setCourseTitle(quiz.getCourse().getTitle());
        }
        res.setTitle(quiz.getTitle());
        res.setDescription(quiz.getDescription());
        res.setPassingScore(quiz.getPassingScore());
        res.setTimeLimitMinutes(quiz.getTimeLimitMinutes());
        if (quiz.getQuestions() != null) {
            res.setTotalQuestions(quiz.getQuestions().size());
            res.setTotalPoints(quiz.getQuestions().stream().mapToInt(q -> q.getPoints() != null ? q.getPoints() : 0).sum());
            res.setQuestions(quiz.getQuestions().stream()
                .map(q -> QuestionResponse.fromEntity(q, includeAnswers))
                .collect(Collectors.toList()));
        } else {
            res.setTotalQuestions(0);
            res.setTotalPoints(0);
        }
        res.setCreatedAt(quiz.getCreatedAt());
        res.setUpdatedAt(quiz.getUpdatedAt());
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

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
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

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Integer getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(Integer totalPoints) {
        this.totalPoints = totalPoints;
    }

    public List<QuestionResponse> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionResponse> questions) {
        this.questions = questions;
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
