package com.example.lms.controller;

import com.example.lms.dto.request.LessonCreateRequest;
import com.example.lms.dto.request.LessonUpdateRequest;
import com.example.lms.dto.response.ApiResponse;
import com.example.lms.dto.response.LessonResponse;
import com.example.lms.security.UserPrincipal;
import com.example.lms.service.LessonService;
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
@Tag(name = "Lessons", description = "Course lesson structure, content, and management APIs")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @GetMapping("/courses/{courseId}/lessons")
    @Operation(summary = "Get all lessons for a specific course")
    public ResponseEntity<ApiResponse<List<LessonResponse>>> getLessonsByCourse(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<LessonResponse> lessons = lessonService.getLessonsByCourseId(courseId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(lessons));
    }

    @GetMapping("/lessons/{lessonId}")
    @Operation(summary = "Get lesson details by lesson ID")
    public ResponseEntity<ApiResponse<LessonResponse>> getLessonById(
            @PathVariable Long lessonId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        LessonResponse lesson = lessonService.getLessonById(lessonId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(lesson));
    }

    @PostMapping("/courses/{courseId}/lessons")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    @Operation(summary = "Add a lesson to a course (Instructor or Admin)")
    public ResponseEntity<ApiResponse<LessonResponse>> createLesson(
            @PathVariable Long courseId,
            @Valid @RequestBody LessonCreateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        LessonResponse created = lessonService.createLesson(courseId, request, currentUser);
        return new ResponseEntity<>(ApiResponse.success("Lesson created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/lessons/{lessonId}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    @Operation(summary = "Update lesson details (Course Instructor or Admin)")
    public ResponseEntity<ApiResponse<LessonResponse>> updateLesson(
            @PathVariable Long lessonId,
            @Valid @RequestBody LessonUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        LessonResponse updated = lessonService.updateLesson(lessonId, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Lesson updated successfully", updated));
    }

    @DeleteMapping("/lessons/{lessonId}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    @Operation(summary = "Delete lesson (Course Instructor or Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteLesson(
            @PathVariable Long lessonId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        lessonService.deleteLesson(lessonId, currentUser);
        return ResponseEntity.ok(ApiResponse.successMessage("Lesson deleted successfully"));
    }
}
