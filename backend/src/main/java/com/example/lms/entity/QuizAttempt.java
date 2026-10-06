package com.example.lms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quiz_attempts")
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer score = 0;

    @Column(name = "total_points", nullable = false)
    private Integer totalPoints = 0;

    @Column(nullable = false)
    private Boolean passed = false;

    @Column(name = "started_at", nullable = false, updatable = false)
    private LocalDateTime startedAt;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<QuizAttemptAnswer> answers = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.startedAt = LocalDateTime.now();
    }

    public QuizAttempt() {}

    public QuizAttempt(Long id, Quiz quiz, User user, Integer score, Integer totalPoints, Boolean passed) {
        this.id = id;
        this.quiz = quiz;
        this.user = user;
        this.score = score != null ? score : 0;
        this.totalPoints = totalPoints != null ? totalPoints : 0;
        this.passed = passed != null ? passed : false;
        this.startedAt = LocalDateTime.now();
        this.submittedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(Integer totalPoints) {
        this.totalPoints = totalPoints;
    }

    public Boolean getPassed() {
        return passed;
    }

    public void setPassed(Boolean passed) {
        this.passed = passed;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public List<QuizAttemptAnswer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<QuizAttemptAnswer> answers) {
        this.answers = answers;
    }

    public void addAnswer(QuizAttemptAnswer answer) {
        this.answers.add(answer);
        answer.setAttempt(this);
    }
}
