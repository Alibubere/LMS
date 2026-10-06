package com.example.lms.service;

import com.example.lms.dto.response.CertificateResponse;
import com.example.lms.entity.Certificate;
import com.example.lms.entity.Course;
import com.example.lms.entity.Enrollment;
import com.example.lms.entity.Quiz;
import com.example.lms.entity.User;
import com.example.lms.exception.BadRequestException;
import com.example.lms.repository.*;
import com.example.lms.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CertificateServiceTest {

    @Mock
    private CertificateRepository certificateRepository;
    @Mock
    private CourseRepository courseRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private LessonRepository lessonRepository;
    @Mock
    private ProgressRepository progressRepository;
    @Mock
    private EnrollmentRepository enrollmentRepository;
    @Mock
    private QuizRepository quizRepository;
    @Mock
    private QuizAttemptRepository quizAttemptRepository;

    @InjectMocks
    private CertificateService certificateService;

    private User learner;
    private Course course;
    private Enrollment enrollment;
    private Quiz quiz;
    private UserPrincipal learnerPrincipal;

    @BeforeEach
    void setUp() {
        learner = new User(10L, "Learner", "learner@test.com", "pass", User.Role.LEARNER);
        course = new Course(1L, "Course", "Desc", null, null, Course.Status.PUBLISHED);
        enrollment = new Enrollment(1L, learner, course, Enrollment.Status.ENROLLED);
        quiz = new Quiz(1L, course, "Quiz 1", "Desc", 70, 30);

        learnerPrincipal = new UserPrincipal(10L, "Learner", "learner@test.com", "pass", User.Role.LEARNER,
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_LEARNER")));
    }

    @Test
    void generateCertificate_Eligible_Success() {
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(userRepository.findById(10L)).thenReturn(Optional.of(learner));
        when(certificateRepository.findByUserIdAndCourseId(10L, 1L)).thenReturn(Optional.empty());
        when(enrollmentRepository.findByUserIdAndCourseId(10L, 1L)).thenReturn(Optional.of(enrollment));

        when(lessonRepository.countByCourseId(1L)).thenReturn(5L);
        when(progressRepository.countByUserIdAndCourseIdAndCompletedTrue(10L, 1L)).thenReturn(5L);

        when(quizRepository.findByCourseId(1L)).thenReturn(Collections.singletonList(quiz));
        when(quizAttemptRepository.existsByQuizIdAndUserIdAndPassedTrue(1L, 10L)).thenReturn(true);

        Certificate savedCert = new Certificate(1L, "LMS-CERT-TEST-1234", learner, course, "DISTINCTION", "url");
        when(certificateRepository.save(any(Certificate.class))).thenReturn(savedCert);

        CertificateResponse response = certificateService.generateCertificate(1L, learnerPrincipal);

        assertNotNull(response);
        assertEquals("LMS-CERT-TEST-1234", response.getCertificateCode());
        assertEquals("DISTINCTION", response.getGrade());
        assertEquals(Enrollment.Status.COMPLETED, enrollment.getStatus());
        verify(certificateRepository).save(any(Certificate.class));
        verify(enrollmentRepository).save(enrollment);
    }

    @Test
    void generateCertificate_LessonsIncomplete_ThrowsBadRequest() {
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(userRepository.findById(10L)).thenReturn(Optional.of(learner));
        when(certificateRepository.findByUserIdAndCourseId(10L, 1L)).thenReturn(Optional.empty());
        when(enrollmentRepository.findByUserIdAndCourseId(10L, 1L)).thenReturn(Optional.of(enrollment));

        when(lessonRepository.countByCourseId(1L)).thenReturn(5L);
        when(progressRepository.countByUserIdAndCourseIdAndCompletedTrue(10L, 1L)).thenReturn(3L); // only 3 of 5

        assertThrows(BadRequestException.class, () -> certificateService.generateCertificate(1L, learnerPrincipal));
    }
}
