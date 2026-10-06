package com.example.lms.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class QuizSubmissionRequest {

    @NotEmpty(message = "Answers list cannot be empty")
    private List<AnswerSubmission> answers;

    public QuizSubmissionRequest() {}

    public QuizSubmissionRequest(List<AnswerSubmission> answers) {
        this.answers = answers;
    }

    public List<AnswerSubmission> getAnswers() {
        return answers;
    }

    public void setAnswers(List<AnswerSubmission> answers) {
        this.answers = answers;
    }

    public static class AnswerSubmission {
        @NotNull(message = "Question ID is required")
        private Long questionId;

        @NotNull(message = "Selected option is required")
        private String selectedOption; // 'A', 'B', 'C', 'D'

        public AnswerSubmission() {}

        public AnswerSubmission(Long questionId, String selectedOption) {
            this.questionId = questionId;
            this.selectedOption = selectedOption;
        }

        public Long getQuestionId() {
            return questionId;
        }

        public void setQuestionId(Long questionId) {
            this.questionId = questionId;
        }

        public String getSelectedOption() {
            return selectedOption;
        }

        public void setSelectedOption(String selectedOption) {
            this.selectedOption = selectedOption;
        }
    }
}
