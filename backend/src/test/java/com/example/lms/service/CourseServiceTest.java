package com.example.lms.service;

import com.example.lms.dto.request.CourseCreateRequest;
import com.example.lms.dto.request.CourseUpdateRequest;
import com.example.lms.dto.response.CourseResponse;
import com.example.lms.entity.Category;
import com.example.lms.entity.Course;
import com.example.lms.entity.User;
import com.example.lms.exception.ForbiddenException;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.repository.CategoryRepository;
import com.example.lms.repository.CourseRepository;
import com.example.lms.repository.EnrollmentRepository;
import com.example.lms.repository.LessonRepository;
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
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private LessonRepository lessonRepository;
    @Mock
    private EnrollmentRepository enrollmentRepository;

    @InjectMocks
    private CourseService courseService;

    private User instructor;
    private User otherInstructor;
    private Category category;
    private Course course;
    private UserPrincipal instructorPrincipal;
    private UserPrincipal learnerPrincipal;

    @BeforeEach
    void setUp() {
        instructor = new User(2L, "Instructor", "instructor@test.com", "pass", User.Role.INSTRUCTOR);
        otherInstructor = new User(3L, "Other", "other@test.com", "pass", User.Role.INSTRUCTOR);
        category = new Category(1L, "Web Development", "Web dev courses");
        course = new Course(1L, "Java Full Stack", "Description", category, instructor, Course.Status.PUBLISHED);

        instructorPrincipal = new UserPrincipal(2L, "Instructor", "instructor@test.com", "pass", User.Role.INSTRUCTOR,
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_INSTRUCTOR")));

        learnerPrincipal = new UserPrincipal(4L, "Learner", "learner@test.com", "pass", User.Role.LEARNER,
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_LEARNER")));
    }

    @Test
    void getCourseById_Success() {
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(lessonRepository.countByCourseId(1L)).thenReturn(5L);
        when(enrollmentRepository.countByCourseId(1L)).thenReturn(20L);

        CourseResponse response = courseService.getCourseById(1L);

        assertNotNull(response);
        assertEquals("Java Full Stack", response.getTitle());
        assertEquals(5L, response.getTotalLessons());
        assertEquals(20L, response.getTotalEnrolled());
    }

    @Test
    void createCourse_AsInstructor_Success() {
        CourseCreateRequest request = new CourseCreateRequest("New Course", "Description", 1L, "PUBLISHED", "url");

        when(userRepository.findById(2L)).thenReturn(Optional.of(instructor));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(courseRepository.save(any(Course.class))).thenReturn(course);
        when(lessonRepository.countByCourseId(1L)).thenReturn(0L);
        when(enrollmentRepository.countByCourseId(1L)).thenReturn(0L);

        CourseResponse response = courseService.createCourse(request, instructorPrincipal);

        assertNotNull(response);
        verify(courseRepository).save(any(Course.class));
    }

    @Test
    void createCourse_AsLearner_ThrowsForbidden() {
        CourseCreateRequest request = new CourseCreateRequest("New Course", "Description", 1L, "PUBLISHED", "url");
        when(userRepository.findById(4L)).thenReturn(Optional.of(new User(4L, "Learner", "learner@test.com", "pass", User.Role.LEARNER)));

        assertThrows(ForbiddenException.class, () -> courseService.createCourse(request, learnerPrincipal));
    }

    @Test
    void updateCourse_UnauthorizedInstructor_ThrowsForbidden() {
        CourseUpdateRequest request = new CourseUpdateRequest("Updated Title", "Desc", 1L, "PUBLISHED", "url");
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        UserPrincipal unauthorizedPrincipal = new UserPrincipal(3L, "Other", "other@test.com", "pass", User.Role.INSTRUCTOR,
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_INSTRUCTOR")));

        assertThrows(ForbiddenException.class, () -> courseService.updateCourse(1L, request, unauthorizedPrincipal));
    }
}
