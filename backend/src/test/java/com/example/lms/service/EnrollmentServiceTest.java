package com.example.lms.service;

import com.example.lms.dto.response.EnrollmentResponse;
import com.example.lms.entity.Course;
import com.example.lms.entity.Enrollment;
import com.example.lms.entity.User;
import com.example.lms.exception.ResourceConflictException;
import com.example.lms.repository.CourseRepository;
import com.example.lms.repository.EnrollmentRepository;
import com.example.lms.repository.LessonRepository;
import com.example.lms.repository.ProgressRepository;
import com.example.lms.repository.UserRepository;
import com.example.lms.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EnrollmentServiceTest {

    @Mock
    private EnrollmentRepository enrollmentRepository;
    @Mock
    private CourseRepository courseRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private LessonRepository lessonRepository;
    @Mock
    private ProgressRepository progressRepository;

    @InjectMocks
    private EnrollmentService enrollmentService;

    private User learner;
    private Course course;
    private UserPrincipal learnerPrincipal;

    @BeforeEach
    void setUp() {
        learner = new User(10L, "Learner", "learner@test.com", "pass", User.Role.LEARNER);
        course = new Course(1L, "Java Course", "Desc", null, null, Course.Status.PUBLISHED);

        learnerPrincipal = new UserPrincipal(10L, "Learner", "learner@test.com", "pass", User.Role.LEARNER,
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_LEARNER")));
    }

    @Test
    void enroll_Success() {
        when(userRepository.findById(10L)).thenReturn(Optional.of(learner));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(enrollmentRepository.findByUserIdAndCourseId(10L, 1L)).thenReturn(Optional.empty());

        Enrollment savedEnrollment = new Enrollment(1L, learner, course, Enrollment.Status.ENROLLED);
        when(enrollmentRepository.save(any(Enrollment.class))).thenReturn(savedEnrollment);
        when(lessonRepository.countByCourseId(1L)).thenReturn(4L);
        when(progressRepository.countByUserIdAndCourseIdAndCompletedTrue(10L, 1L)).thenReturn(0L);

        EnrollmentResponse response = enrollmentService.enroll(1L, null, learnerPrincipal);

        assertNotNull(response);
        assertEquals("ENROLLED", response.getStatus());
        assertEquals(0.0, response.getProgressPercentage());
        verify(enrollmentRepository).save(any(Enrollment.class));
    }

    @Test
    void enroll_DuplicateActiveEnrollment_ThrowsConflict() {
        when(userRepository.findById(10L)).thenReturn(Optional.of(learner));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        Enrollment existing = new Enrollment(1L, learner, course, Enrollment.Status.ENROLLED);
        when(enrollmentRepository.findByUserIdAndCourseId(10L, 1L)).thenReturn(Optional.of(existing));

        assertThrows(ResourceConflictException.class, () -> enrollmentService.enroll(1L, null, learnerPrincipal));
        verify(enrollmentRepository, never()).save(any(Enrollment.class));
    }
}
