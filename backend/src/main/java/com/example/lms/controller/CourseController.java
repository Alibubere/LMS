package com.example.lms.controller;

import com.example.lms.dto.request.CourseCreateRequest;
import com.example.lms.dto.request.CourseUpdateRequest;
import com.example.lms.dto.response.ApiResponse;
import com.example.lms.dto.response.CourseResponse;
import com.example.lms.security.UserPrincipal;
import com.example.lms.service.CourseService;
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
@RequestMapping("/api/v1/courses")
@Tag(name = "Courses", description = "Course discovery, catalog, and management APIs")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    @Operation(summary = "List courses with optional search, category, status, and instructor filters")
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getAllCourses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long instructorId) {
        List<CourseResponse> courses = courseService.getAllCourses(search, categoryId, status, instructorId);
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detailed course information by ID")
    public ResponseEntity<ApiResponse<CourseResponse>> getCourseById(@PathVariable Long id) {
        CourseResponse course = courseService.getCourseById(id);
        return ResponseEntity.ok(ApiResponse.success(course));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    @Operation(summary = "Create a new course (Instructor or Admin)")
    public ResponseEntity<ApiResponse<CourseResponse>> createCourse(
            @Valid @RequestBody CourseCreateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        CourseResponse created = courseService.createCourse(request, currentUser);
        return new ResponseEntity<>(ApiResponse.success("Course created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    @Operation(summary = "Update course (Course Instructor or Admin)")
    public ResponseEntity<ApiResponse<CourseResponse>> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CourseUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        CourseResponse updated = courseService.updateCourse(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Course updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    @Operation(summary = "Delete course (Course Instructor or Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        courseService.deleteCourse(id, currentUser);
        return ResponseEntity.ok(ApiResponse.successMessage("Course deleted successfully"));
    }
}
