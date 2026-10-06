package com.example.lms.controller;

import com.example.lms.dto.request.ProgressUpdateRequest;
import com.example.lms.dto.response.ApiResponse;
import com.example.lms.dto.response.CourseProgressResponse;
import com.example.lms.dto.response.ProgressResponse;
import com.example.lms.security.UserPrincipal;
import com.example.lms.service.ProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Progress", description = "Learning progress, lesson completion, and overall course completion APIs")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping("/courses/{courseId}/progress")
    @Operation(summary = "Get user's overall progress for a course")
    public ResponseEntity<ApiResponse<CourseProgressResponse>> getCourseProgress(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        CourseProgressResponse response = progressService.getCourseProgress(courseId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/lessons/{lessonId}/progress")
    @Operation(summary = "Record or update lesson progress")
    public ResponseEntity<ApiResponse<ProgressResponse>> recordLessonProgress(
            @PathVariable Long lessonId,
            @Valid @RequestBody ProgressUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ProgressResponse response = progressService.updateLessonProgress(lessonId, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Lesson progress recorded", response));
    }

    @PatchMapping("/lessons/{lessonId}/progress")
    @Operation(summary = "Partially update lesson progress / toggle completion")
    public ResponseEntity<ApiResponse<ProgressResponse>> patchLessonProgress(
            @PathVariable Long lessonId,
            @Valid @RequestBody ProgressUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ProgressResponse response = progressService.updateLessonProgress(lessonId, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Lesson progress updated", response));
    }
}
