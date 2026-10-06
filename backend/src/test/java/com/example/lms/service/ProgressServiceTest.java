package com.example.lms.service;

import com.example.lms.dto.request.ProgressUpdateRequest;
import com.example.lms.dto.response.CourseProgressResponse;
import com.example.lms.dto.response.ProgressResponse;
import com.example.lms.entity.Course;
import com.example.lms.entity.Enrollment;
import com.example.lms.entity.Lesson;
import com.example.lms.entity.Progress;
import com.example.lms.entity.User;
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
class ProgressServiceTest {

    @Mock
    private ProgressRepository progressRepository;
    @Mock
    private LessonRepository lessonRepository;
    @Mock
    private CourseRepository courseRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private EnrollmentRepository enrollmentRepository;

    @InjectMocks
    private ProgressService progressService;

    private User learner;
    private Course course;
    private Lesson lesson;
    private UserPrincipal learnerPrincipal;

    @BeforeEach
    void setUp() {
        learner = new User(10L, "Learner", "learner@test.com", "pass", User.Role.LEARNER);
        course = new Course(1L, "Course", "Desc", null, null, Course.Status.PUBLISHED);
        lesson = new Lesson(5L, course, "Lesson 1", "Desc", "url", "text", 1, 15);

        learnerPrincipal = new UserPrincipal(10L, "Learner", "learner@test.com", "pass", User.Role.LEARNER,
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_LEARNER")));
    }

    @Test
    void getCourseProgress_Success() {
        when(courseRepository.existsById(1L)).thenReturn(true);
        when(lessonRepository.countByCourseId(1L)).thenReturn(2L);
        when(progressRepository.countByUserIdAndCourseIdAndCompletedTrue(10L, 1L)).thenReturn(1L);
        when(progressRepository.findByUserIdAndCourseId(10L, 1L)).thenReturn(Collections.emptyList());

        CourseProgressResponse response = progressService.getCourseProgress(1L, learnerPrincipal);

        assertNotNull(response);
        assertEquals(50.0, response.getOverallProgressPercentage());
        assertEquals(1L, response.getCompletedLessons());
        assertEquals(2L, response.getTotalLessons());
        assertFalse(response.getCourseCompleted());
    }

    @Test
    void updateLessonProgress_MarksCompleted_UpdatesEnrollment() {
        ProgressUpdateRequest request = new ProgressUpdateRequest(true, 900, 100.0);

        when(lessonRepository.findById(5L)).thenReturn(Optional.of(lesson));
        when(userRepository.findById(10L)).thenReturn(Optional.of(learner));
        when(progressRepository.findByUserIdAndLessonId(10L, 5L)).thenReturn(Optional.empty());

        Progress saved = new Progress(1L, learner, course, lesson, true, 900, 100.0);
        when(progressRepository.save(any(Progress.class))).thenReturn(saved);

        when(lessonRepository.countByCourseId(1L)).thenReturn(1L);
        when(progressRepository.countByUserIdAndCourseIdAndCompletedTrue(10L, 1L)).thenReturn(1L);

        Enrollment enrollment = new Enrollment(1L, learner, course, Enrollment.Status.ENROLLED);
        when(enrollmentRepository.findByUserIdAndCourseId(10L, 1L)).thenReturn(Optional.of(enrollment));

        ProgressResponse response = progressService.updateLessonProgress(5L, request, learnerPrincipal);

        assertNotNull(response);
        assertTrue(response.getCompleted());
        assertEquals(100.0, response.getCompletionPercentage());
        assertEquals(Enrollment.Status.COMPLETED, enrollment.getStatus());
        verify(enrollmentRepository).save(enrollment);
    }
}
