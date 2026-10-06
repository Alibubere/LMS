package com.example.lms.controller;

import com.example.lms.dto.request.QuizCreateRequest;
import com.example.lms.dto.request.QuizSubmissionRequest;
import com.example.lms.dto.request.QuizUpdateRequest;
import com.example.lms.dto.response.ApiResponse;
import com.example.lms.dto.response.QuizAttemptResponse;
import com.example.lms.dto.response.QuizResponse;
import com.example.lms.security.UserPrincipal;
import com.example.lms.service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Assessments & Quizzes", description = "Course quizzes, questions, answer submission, and score calculation APIs")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/courses/{courseId}/quizzes")
    @Operation(summary = "Get all quizzes for a course")
    public ResponseEntity<ApiResponse<List<QuizResponse>>> getQuizzesByCourse(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<QuizResponse> quizzes = quizService.getQuizzesByCourseId(courseId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(quizzes));
    }

    @GetMapping("/quizzes/{quizId}")
    @Operation(summary = "Get quiz details and questions")
    public ResponseEntity<ApiResponse<QuizResponse>> getQuizById(
            @PathVariable Long quizId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        QuizResponse quiz = quizService.getQuizById(quizId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(quiz));
    }

    @PostMapping("/quizzes/{quizId}/attempts")
    @Operation(summary = "Submit quiz answers for authoritative backend evaluation")
    public ResponseEntity<ApiResponse<QuizAttemptResponse>> submitQuiz(
            @PathVariable Long quizId,
            @Valid @RequestBody QuizSubmissionRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        QuizAttemptResponse result = quizService.submitQuiz(quizId, request, currentUser);
        return new ResponseEntity<>(ApiResponse.success("Quiz submitted and evaluated successfully", result), HttpStatus.CREATED);
    }

    @GetMapping("/quizzes/{quizId}/results")
    @Operation(summary = "Get quiz attempt results (Learner own results, or Instructor/Admin course results)")
    public ResponseEntity<ApiResponse<List<QuizAttemptResponse>>> getQuizResults(
            @PathVariable Long quizId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<QuizAttemptResponse> results = quizService.getQuizResults(quizId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @PostMapping("/courses/{courseId}/quizzes")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    @Operation(summary = "Create quiz with questions for a course (Instructor or Admin)")
    public ResponseEntity<ApiResponse<QuizResponse>> createQuiz(
            @PathVariable Long courseId,
            @Valid @RequestBody QuizCreateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        QuizResponse created = quizService.createQuiz(courseId, request, currentUser);
        return new ResponseEntity<>(ApiResponse.success("Quiz created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/quizzes/{quizId}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    @Operation(summary = "Update quiz details (Course Instructor or Admin)")
    public ResponseEntity<ApiResponse<QuizResponse>> updateQuiz(
            @PathVariable Long quizId,
            @Valid @RequestBody QuizUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        QuizResponse updated = quizService.updateQuiz(quizId, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Quiz updated successfully", updated));
    }

    @DeleteMapping("/quizzes/{quizId}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    @Operation(summary = "Delete quiz (Course Instructor or Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteQuiz(
            @PathVariable Long quizId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        quizService.deleteQuiz(quizId, currentUser);
        return ResponseEntity.ok(ApiResponse.successMessage("Quiz deleted successfully"));
    }
}
