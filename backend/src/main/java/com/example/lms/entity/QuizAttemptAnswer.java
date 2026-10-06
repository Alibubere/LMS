package com.example.lms.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "quiz_attempt_answers")
public class QuizAttemptAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id", nullable = false)
    private QuizAttempt attempt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "selected_option", nullable = false, length = 10)
    private String selectedOption;

    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect = false;

    @Column(name = "points_awarded", nullable = false)
    private Integer pointsAwarded = 0;

    public QuizAttemptAnswer() {}

    public QuizAttemptAnswer(Long id, QuizAttempt attempt, Question question, String selectedOption, Boolean isCorrect, Integer pointsAwarded) {
        this.id = id;
        this.attempt = attempt;
        this.question = question;
        this.selectedOption = selectedOption;
        this.isCorrect = isCorrect != null ? isCorrect : false;
        this.pointsAwarded = pointsAwarded != null ? pointsAwarded : 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public QuizAttempt getAttempt() {
        return attempt;
    }

    public void setAttempt(QuizAttempt attempt) {
        this.attempt = attempt;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public String getSelectedOption() {
        return selectedOption;
    }

    public void setSelectedOption(String selectedOption) {
        this.selectedOption = selectedOption;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }

    public Integer getPointsAwarded() {
        return pointsAwarded;
    }

    public void setPointsAwarded(Integer pointsAwarded) {
        this.pointsAwarded = pointsAwarded;
    }
}
