package com.example.lms.dto.response;

import com.example.lms.entity.QuizAttempt;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class QuizAttemptResponse {
    private Long id;
    private Long quizId;
    private String quizTitle;
    private Long userId;
    private String userName;
    private Integer score;
    private Integer totalPoints;
    private Double percentage;
    private Boolean passed;
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
    private List<AnswerResultResponse> answers;

    public QuizAttemptResponse() {}

    public static QuizAttemptResponse fromEntity(QuizAttempt attempt) {
        if (attempt == null) return null;
        QuizAttemptResponse res = new QuizAttemptResponse();
        res.setId(attempt.getId());
        if (attempt.getQuiz() != null) {
            res.setQuizId(attempt.getQuiz().getId());
            res.setQuizTitle(attempt.getQuiz().getTitle());
        }
        if (attempt.getUser() != null) {
            res.setUserId(attempt.getUser().getId());
            res.setUserName(attempt.getUser().getName());
        }
        res.setScore(attempt.getScore());
        res.setTotalPoints(attempt.getTotalPoints());
        double pct = attempt.getTotalPoints() > 0 ? ((double) attempt.getScore() / attempt.getTotalPoints()) * 100.0 : 0.0;
        res.setPercentage(Math.round(pct * 100.0) / 100.0);
        res.setPassed(attempt.getPassed());
        res.setStartedAt(attempt.getStartedAt());
        res.setSubmittedAt(attempt.getSubmittedAt());

        if (attempt.getAnswers() != null) {
            res.setAnswers(attempt.getAnswers().stream().map(a -> {
                AnswerResultResponse ansRes = new AnswerResultResponse();
                ansRes.setId(a.getId());
                if (a.getQuestion() != null) {
                    ansRes.setQuestionId(a.getQuestion().getId());
                    ansRes.setQuestionText(a.getQuestion().getQuestionText());
                    ansRes.setCorrectOption(a.getQuestion().getCorrectOption());
                    ansRes.setExplanation(a.getQuestion().getExplanation());
                }
                ansRes.setSelectedOption(a.getSelectedOption());
                ansRes.setIsCorrect(a.getIsCorrect());
                ansRes.setPointsAwarded(a.getPointsAwarded());
                return ansRes;
            }).collect(Collectors.toList()));
        }
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public String getQuizTitle() {
        return quizTitle;
    }

    public void setQuizTitle(String quizTitle) {
        this.quizTitle = quizTitle;
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

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
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

    public List<AnswerResultResponse> getAnswers() {
        return answers;
    }

    public void setAnswers(List<AnswerResultResponse> answers) {
        this.answers = answers;
    }

    public static class AnswerResultResponse {
        private Long id;
        private Long questionId;
        private String questionText;
        private String selectedOption;
        private String correctOption;
        private Boolean isCorrect;
        private Integer pointsAwarded;
        private String explanation;

        public AnswerResultResponse() {}

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getQuestionId() {
            return questionId;
        }

        public void setQuestionId(Long questionId) {
            this.questionId = questionId;
        }

        public String getQuestionText() {
            return questionText;
        }

        public void setQuestionText(String questionText) {
            this.questionText = questionText;
        }

        public String getSelectedOption() {
            return selectedOption;
        }

        public void setSelectedOption(String selectedOption) {
            this.selectedOption = selectedOption;
        }

        public String getCorrectOption() {
            return correctOption;
        }

        public void setCorrectOption(String correctOption) {
            this.correctOption = correctOption;
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

        public String getExplanation() {
            return explanation;
        }

        public void setExplanation(String explanation) {
            this.explanation = explanation;
        }
    }
}
