package com.example.lms.service;

import com.example.lms.dto.request.FeedbackRequest;
import com.example.lms.dto.response.FeedbackResponse;
import com.example.lms.entity.Course;
import com.example.lms.entity.Feedback;
import com.example.lms.entity.User;
import com.example.lms.exception.BadRequestException;
import com.example.lms.exception.ForbiddenException;
import com.example.lms.exception.ResourceConflictException;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.repository.CourseRepository;
import com.example.lms.repository.FeedbackRepository;
import com.example.lms.repository.UserRepository;
import com.example.lms.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentService enrollmentService;

    public FeedbackService(FeedbackRepository feedbackRepository,
                           CourseRepository courseRepository,
                           UserRepository userRepository,
                           EnrollmentService enrollmentService) {
        this.feedbackRepository = feedbackRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.enrollmentService = enrollmentService;
    }

    @Transactional(readOnly = true)
    public List<FeedbackResponse> getCourseFeedback(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }

        return feedbackRepository.findByCourseIdOrderByCreatedAtDesc(courseId).stream()
            .map(FeedbackResponse::fromEntity)
            .collect(Collectors.toList());
    }

    @Transactional
    public FeedbackResponse submitFeedback(Long courseId, FeedbackRequest request, UserPrincipal currentUser) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        User user = userRepository.findById(currentUser.getId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!enrollmentService.isEnrolled(currentUser.getId(), courseId) && currentUser.getRole() != User.Role.ADMIN) {
            throw new BadRequestException("You must be enrolled in this course to leave feedback");
        }

        if (feedbackRepository.existsByUserIdAndCourseId(currentUser.getId(), courseId)) {
            throw new ResourceConflictException("You have already submitted feedback for this course. You can update your existing review.");
        }

        Feedback feedback = new Feedback(
            null,
            course,
            user,
            request.getRating(),
            request.getComment()
        );

        Feedback saved = feedbackRepository.save(feedback);
        return FeedbackResponse.fromEntity(saved);
    }

    @Transactional
    public FeedbackResponse updateFeedback(Long feedbackId, FeedbackRequest request, UserPrincipal currentUser) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
            .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with id: " + feedbackId));

        if (!feedback.getUser().getId().equals(currentUser.getId()) && currentUser.getRole() != User.Role.ADMIN) {
            throw new ForbiddenException("You are not authorized to edit this feedback");
        }

        if (request.getRating() != null) {
            feedback.setRating(request.getRating());
        }
        if (request.getComment() != null) {
            feedback.setComment(request.getComment());
        }

        Feedback updated = feedbackRepository.save(feedback);
        return FeedbackResponse.fromEntity(updated);
    }
}
