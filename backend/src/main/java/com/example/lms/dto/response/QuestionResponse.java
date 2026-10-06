package com.example.lms.dto.response;

import com.example.lms.entity.Question;

public class QuestionResponse {
    private Long id;
    private Long quizId;
    private String questionText;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String correctOption; // Only shown to instructor/admin or in results
    private Integer points;
    private String explanation;

    public QuestionResponse() {}

    public static QuestionResponse fromEntity(Question q, boolean includeAnswers) {
        if (q == null) return null;
        QuestionResponse res = new QuestionResponse();
        res.setId(q.getId());
        if (q.getQuiz() != null) res.setQuizId(q.getQuiz().getId());
        res.setQuestionText(q.getQuestionText());
        res.setOptionA(q.getOptionA());
        res.setOptionB(q.getOptionB());
        res.setOptionC(q.getOptionC());
        res.setOptionD(q.getOptionD());
        res.setPoints(q.getPoints());
        if (includeAnswers) {
            res.setCorrectOption(q.getCorrectOption());
            res.setExplanation(q.getExplanation());
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

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getOptionA() {
        return optionA;
    }

    public void setOptionA(String optionA) {
        this.optionA = optionA;
    }

    public String getOptionB() {
        return optionB;
    }

    public void setOptionB(String optionB) {
        this.optionB = optionB;
    }

    public String getOptionC() {
        return optionC;
    }

    public void setOptionC(String optionC) {
        this.optionC = optionC;
    }

    public String getOptionD() {
        return optionD;
    }

    public void setOptionD(String optionD) {
        this.optionD = optionD;
    }

    public String getCorrectOption() {
        return correctOption;
    }

    public void setCorrectOption(String correctOption) {
        this.correctOption = correctOption;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
