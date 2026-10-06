package com.example.lms.service;

import com.example.lms.dto.request.ProgressUpdateRequest;
import com.example.lms.dto.response.CourseProgressResponse;
import com.example.lms.dto.response.ProgressResponse;
import com.example.lms.entity.Course;
import com.example.lms.entity.Enrollment;
import com.example.lms.entity.Lesson;
import com.example.lms.entity.Progress;
import com.example.lms.entity.User;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.repository.CourseRepository;
import com.example.lms.repository.EnrollmentRepository;
import com.example.lms.repository.LessonRepository;
import com.example.lms.repository.ProgressRepository;
import com.example.lms.repository.UserRepository;
import com.example.lms.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProgressService {

    private final ProgressRepository progressRepository;
    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    public ProgressService(ProgressRepository progressRepository,
                           LessonRepository lessonRepository,
                           CourseRepository courseRepository,
                           UserRepository userRepository,
                           EnrollmentRepository enrollmentRepository) {
        this.progressRepository = progressRepository;
        this.lessonRepository = lessonRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @Transactional(readOnly = true)
    public CourseProgressResponse getCourseProgress(Long courseId, UserPrincipal currentUser) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }

        long totalLessons = lessonRepository.countByCourseId(courseId);
        long completedLessons = progressRepository.countByUserIdAndCourseIdAndCompletedTrue(currentUser.getId(), courseId);

        double pct = totalLessons > 0 ? ((double) completedLessons / totalLessons) * 100.0 : 0.0;
        double roundedPct = Math.round(pct * 100.0) / 100.0;
        boolean courseCompleted = totalLessons > 0 && completedLessons >= totalLessons;

        List<Progress> progressList = progressRepository.findByUserIdAndCourseId(currentUser.getId(), courseId);
        List<ProgressResponse> lessonProgress = progressList.stream()
            .map(ProgressResponse::fromEntity)
            .collect(Collectors.toList());

        return new CourseProgressResponse(
            courseId,
            currentUser.getId(),
            completedLessons,
            totalLessons,
            roundedPct,
            courseCompleted,
            lessonProgress
        );
    }

    @Transactional
    public ProgressResponse updateLessonProgress(Long lessonId, ProgressUpdateRequest request, UserPrincipal currentUser) {
        Lesson lesson = lessonRepository.findById(lessonId)
            .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        User user = userRepository.findById(currentUser.getId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Course course = lesson.getCourse();

        Progress progress = progressRepository.findByUserIdAndLessonId(user.getId(), lessonId)
            .orElse(new Progress(null, user, course, lesson, false, 0, 0.0));

        if (request.getCompleted() != null) {
            progress.setCompleted(request.getCompleted());
            if (request.getCompleted() && progress.getCompletionPercentage() < 100.0) {
                progress.setCompletionPercentage(100.0);
            }
        }
        if (request.getWatchTimeSeconds() != null) {
            progress.setWatchTimeSeconds(request.getWatchTimeSeconds());
        }
        if (request.getCompletionPercentage() != null) {
            progress.setCompletionPercentage(request.getCompletionPercentage());
            if (request.getCompletionPercentage() >= 100.0) {
                progress.setCompleted(true);
            }
        }

        Progress saved = progressRepository.save(progress);

        // Check if all lessons completed and update enrollment status
        checkAndUpdateCourseCompletion(user.getId(), course.getId());

        return ProgressResponse.fromEntity(saved);
    }

    private void checkAndUpdateCourseCompletion(Long userId, Long courseId) {
        long totalLessons = lessonRepository.countByCourseId(courseId);
        long completedLessons = progressRepository.countByUserIdAndCourseIdAndCompletedTrue(userId, courseId);

        if (totalLessons > 0 && completedLessons >= totalLessons) {
            Optional<Enrollment> enrollmentOpt = enrollmentRepository.findByUserIdAndCourseId(userId, courseId);
            enrollmentOpt.ifPresent(enrollment -> {
                if (enrollment.getStatus() == Enrollment.Status.ENROLLED) {
                    enrollment.setStatus(Enrollment.Status.COMPLETED);
                    enrollment.setCompletedAt(LocalDateTime.now());
                    enrollmentRepository.save(enrollment);
                }
            });
        }
    }
}
