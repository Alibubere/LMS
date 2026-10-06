package com.example.lms.controller;

import com.example.lms.dto.response.ApiResponse;
import com.example.lms.dto.response.EnrollmentResponse;
import com.example.lms.security.UserPrincipal;
import com.example.lms.service.EnrollmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Enrollments", description = "Course enrollment, unenrollment, and user enrollments APIs")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping("/courses/{courseId}/enroll")
    @Operation(summary = "Enroll in a course")
    public ResponseEntity<ApiResponse<EnrollmentResponse>> enroll(
            @PathVariable Long courseId,
            @RequestBody(required = false) Map<String, Long> body,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        Long requestedUserId = body != null ? body.get("userId") : null;
        EnrollmentResponse response = enrollmentService.enroll(courseId, requestedUserId, currentUser);
        return new ResponseEntity<>(ApiResponse.success("Enrolled successfully in course", response), HttpStatus.CREATED);
    }

    @DeleteMapping("/courses/{courseId}/enroll")
    @Operation(summary = "Unenroll / drop a course")
    public ResponseEntity<ApiResponse<Void>> unenroll(
            @PathVariable Long courseId,
            @RequestParam(required = false) Long userId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        enrollmentService.unenroll(courseId, userId, currentUser);
        return ResponseEntity.ok(ApiResponse.successMessage("Unenrolled successfully from course"));
    }

    @GetMapping("/users/{userId}/enrollments")
    @Operation(summary = "Get user's enrolled courses")
    public ResponseEntity<ApiResponse<List<EnrollmentResponse>>> getUserEnrollments(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<EnrollmentResponse> enrollments = enrollmentService.getUserEnrollments(userId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(enrollments));
    }
}
