package com.example.lms.controller;

import com.example.lms.dto.request.FeedbackRequest;
import com.example.lms.dto.response.ApiResponse;
import com.example.lms.dto.response.FeedbackResponse;
import com.example.lms.security.UserPrincipal;
import com.example.lms.service.FeedbackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Feedback", description = "Course ratings, reviews, and feedback APIs")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @GetMapping("/courses/{courseId}/feedback")
    @Operation(summary = "Get all feedback and reviews for a course")
    public ResponseEntity<ApiResponse<List<FeedbackResponse>>> getCourseFeedback(@PathVariable Long courseId) {
        List<FeedbackResponse> feedback = feedbackService.getCourseFeedback(courseId);
        return ResponseEntity.ok(ApiResponse.success(feedback));
    }

    @PostMapping("/courses/{courseId}/feedback")
    @Operation(summary = "Submit course feedback and rating (Enrolled Learner)")
    public ResponseEntity<ApiResponse<FeedbackResponse>> submitFeedback(
            @PathVariable Long courseId,
            @Valid @RequestBody FeedbackRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        FeedbackResponse created = feedbackService.submitFeedback(courseId, request, currentUser);
        return new ResponseEntity<>(ApiResponse.success("Feedback submitted successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/feedback/{feedbackId}")
    @Operation(summary = "Update feedback and rating (Author)")
    public ResponseEntity<ApiResponse<FeedbackResponse>> updateFeedback(
            @PathVariable Long feedbackId,
            @Valid @RequestBody FeedbackRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        FeedbackResponse updated = feedbackService.updateFeedback(feedbackId, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Feedback updated successfully", updated));
    }
}
