package com.example.lms.controller;

import com.example.lms.dto.request.DiscussionCreateRequest;
import com.example.lms.dto.request.DiscussionReplyRequest;
import com.example.lms.dto.response.ApiResponse;
import com.example.lms.dto.response.DiscussionResponse;
import com.example.lms.security.UserPrincipal;
import com.example.lms.service.DiscussionService;
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
@Tag(name = "Discussions", description = "Course forum discussions, questions, and replies APIs")
public class DiscussionController {

    private final DiscussionService discussionService;

    public DiscussionController(DiscussionService discussionService) {
        this.discussionService = discussionService;
    }

    @GetMapping("/courses/{courseId}/discussions")
    @Operation(summary = "Get discussion threads and replies for a course")
    public ResponseEntity<ApiResponse<List<DiscussionResponse>>> getCourseDiscussions(@PathVariable Long courseId) {
        List<DiscussionResponse> discussions = discussionService.getCourseDiscussions(courseId);
        return ResponseEntity.ok(ApiResponse.success(discussions));
    }

    @PostMapping("/courses/{courseId}/discussions")
    @Operation(summary = "Create a new discussion thread in a course")
    public ResponseEntity<ApiResponse<DiscussionResponse>> createDiscussion(
            @PathVariable Long courseId,
            @Valid @RequestBody DiscussionCreateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        DiscussionResponse created = discussionService.createDiscussion(courseId, request, currentUser);
        return new ResponseEntity<>(ApiResponse.success("Discussion thread created successfully", created), HttpStatus.CREATED);
    }

    @PostMapping("/discussions/{discussionId}/replies")
    @Operation(summary = "Reply to an existing discussion thread")
    public ResponseEntity<ApiResponse<DiscussionResponse>> replyToDiscussion(
            @PathVariable Long discussionId,
            @Valid @RequestBody DiscussionReplyRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        DiscussionResponse reply = discussionService.replyToDiscussion(discussionId, request, currentUser);
        return new ResponseEntity<>(ApiResponse.success("Reply added successfully", reply), HttpStatus.CREATED);
    }

    @DeleteMapping("/discussions/{discussionId}")
    @Operation(summary = "Delete a discussion thread or reply (Author or Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteDiscussion(
            @PathVariable Long discussionId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        discussionService.deleteDiscussion(discussionId, currentUser);
        return ResponseEntity.ok(ApiResponse.successMessage("Discussion deleted successfully"));
    }
}
