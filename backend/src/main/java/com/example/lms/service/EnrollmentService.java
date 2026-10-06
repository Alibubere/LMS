package com.example.lms.service;

import com.example.lms.dto.response.EnrollmentResponse;
import com.example.lms.entity.Course;
import com.example.lms.entity.Enrollment;
import com.example.lms.entity.User;
import com.example.lms.exception.ForbiddenException;
import com.example.lms.exception.ResourceConflictException;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.repository.CourseRepository;
import com.example.lms.repository.EnrollmentRepository;
import com.example.lms.repository.LessonRepository;
import com.example.lms.repository.ProgressRepository;
import com.example.lms.repository.UserRepository;
import com.example.lms.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final ProgressRepository progressRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                             CourseRepository courseRepository,
                             UserRepository userRepository,
                             LessonRepository lessonRepository,
                             ProgressRepository progressRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
        this.progressRepository = progressRepository;
    }

    @Transactional
    public EnrollmentResponse enroll(Long courseId, Long requestedUserId, UserPrincipal currentUser) {
        Long targetUserId = (requestedUserId != null && currentUser.getRole() == User.Role.ADMIN)
            ? requestedUserId
            : currentUser.getId();

        User user = userRepository.findById(targetUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + targetUserId));

        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        // Check if user is already enrolled
        Optional<Enrollment> existingOpt = enrollmentRepository.findByUserIdAndCourseId(targetUserId, courseId);
        if (existingOpt.isPresent()) {
            Enrollment existing = existingOpt.get();
            if (existing.getStatus() == Enrollment.Status.ENROLLED) {
                throw new ResourceConflictException("User is already actively enrolled in this course");
            } else {
                // Re-enroll if previously dropped
                existing.setStatus(Enrollment.Status.ENROLLED);
                existing.setCompletedAt(null);
                Enrollment updated = enrollmentRepository.save(existing);
                return mapToResponse(updated);
            }
        }

        Enrollment enrollment = new Enrollment(null, user, course, Enrollment.Status.ENROLLED);
        Enrollment saved = enrollmentRepository.save(enrollment);

        return mapToResponse(saved);
    }

    @Transactional
    public void unenroll(Long courseId, Long requestedUserId, UserPrincipal currentUser) {
        Long targetUserId = (requestedUserId != null && currentUser.getRole() == User.Role.ADMIN)
            ? requestedUserId
            : currentUser.getId();

        Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(targetUserId, courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Active enrollment not found for course id: " + courseId));

        enrollment.setStatus(Enrollment.Status.DROPPED);
        enrollmentRepository.save(enrollment);
    }

    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getUserEnrollments(Long userId, UserPrincipal currentUser) {
        if (!currentUser.getId().equals(userId) && currentUser.getRole() != User.Role.ADMIN) {
            throw new ForbiddenException("You can only view your own enrollments");
        }

        return enrollmentRepository.findByUserId(userId).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public boolean isEnrolled(Long userId, Long courseId) {
        return enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
            .map(e -> e.getStatus() == Enrollment.Status.ENROLLED || e.getStatus() == Enrollment.Status.COMPLETED)
            .orElse(false);
    }

    private EnrollmentResponse mapToResponse(Enrollment enrollment) {
        Long courseId = enrollment.getCourse().getId();
        Long userId = enrollment.getUser().getId();

        long totalLessons = lessonRepository.countByCourseId(courseId);
        long completedLessons = progressRepository.countByUserIdAndCourseIdAndCompletedTrue(userId, courseId);

        double progress = totalLessons > 0 ? ((double) completedLessons / totalLessons) * 100.0 : 0.0;
        double rounded = Math.round(progress * 100.0) / 100.0;

        return EnrollmentResponse.fromEntity(enrollment, rounded);
    }
}
