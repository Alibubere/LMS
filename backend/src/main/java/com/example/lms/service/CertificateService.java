package com.example.lms.service;

import com.example.lms.dto.response.CertificateResponse;
import com.example.lms.entity.*;
import com.example.lms.exception.BadRequestException;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.repository.*;
import com.example.lms.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final ProgressRepository progressRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final QuizRepository quizRepository;
    private final QuizAttemptRepository quizAttemptRepository;

    public CertificateService(CertificateRepository certificateRepository,
                              CourseRepository courseRepository,
                              UserRepository userRepository,
                              LessonRepository lessonRepository,
                              ProgressRepository progressRepository,
                              EnrollmentRepository enrollmentRepository,
                              QuizRepository quizRepository,
                              QuizAttemptRepository quizAttemptRepository) {
        this.certificateRepository = certificateRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
        this.progressRepository = progressRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.quizRepository = quizRepository;
        this.quizAttemptRepository = quizAttemptRepository;
    }

    @Transactional(readOnly = true)
    public CertificateResponse getCertificate(Long courseId, UserPrincipal currentUser) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }

        Certificate cert = certificateRepository.findByUserIdAndCourseId(currentUser.getId(), courseId)
            .orElseThrow(() -> new ResourceNotFoundException("No certificate found for this course and user. Complete the course and generate your certificate first."));

        return CertificateResponse.fromEntity(cert);
    }

    @Transactional
    public CertificateResponse generateCertificate(Long courseId, UserPrincipal currentUser) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        User user = userRepository.findById(currentUser.getId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // If certificate already exists, return existing certificate
        Optional<Certificate> existingCert = certificateRepository.findByUserIdAndCourseId(user.getId(), courseId);
        if (existingCert.isPresent()) {
            return CertificateResponse.fromEntity(existingCert.get());
        }

        // 1. Verify enrollment
        Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(user.getId(), courseId)
            .orElseThrow(() -> new BadRequestException("You are not enrolled in this course"));

        // 2. Verify lesson completion
        long totalLessons = lessonRepository.countByCourseId(courseId);
        long completedLessons = progressRepository.countByUserIdAndCourseIdAndCompletedTrue(user.getId(), courseId);

        if (totalLessons > 0 && completedLessons < totalLessons) {
            throw new BadRequestException("Course completion requirements not met: You have completed " + completedLessons + " of " + totalLessons + " lessons");
        }

        // 3. Verify quiz completion if course has quizzes
        List<Quiz> quizzes = quizRepository.findByCourseId(courseId);
        if (!quizzes.isEmpty()) {
            for (Quiz quiz : quizzes) {
                boolean passedQuiz = quizAttemptRepository.existsByQuizIdAndUserIdAndPassedTrue(quiz.getId(), user.getId());
                if (!passedQuiz) {
                    throw new BadRequestException("Course assessment requirements not met: You must pass quiz '" + quiz.getTitle() + "' before generating certificate");
                }
            }
        }

        // Mark enrollment as completed
        enrollment.setStatus(Enrollment.Status.COMPLETED);
        enrollment.setCompletedAt(LocalDateTime.now());
        enrollmentRepository.save(enrollment);

        // Generate unique certificate code
        String certificateCode = "LMS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase() + "-" + System.currentTimeMillis() % 10000;
        String certificateUrl = "/api/v1/courses/" + courseId + "/certificate";

        Certificate certificate = new Certificate(
            null,
            certificateCode,
            user,
            course,
            "DISTINCTION",
            certificateUrl
        );

        Certificate saved = certificateRepository.save(certificate);
        return CertificateResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<CertificateResponse> getUserCertificates(Long userId) {
        return certificateRepository.findByUserId(userId).stream()
            .map(CertificateResponse::fromEntity)
            .collect(Collectors.toList());
    }
}
