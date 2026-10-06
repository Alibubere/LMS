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
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;

    public CourseService(CourseRepository courseRepository,
                         CategoryRepository categoryRepository,
                         UserRepository userRepository,
                         LessonRepository lessonRepository,
                         EnrollmentRepository enrollmentRepository) {
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getAllCourses(String search, Long categoryId, String status, Long instructorId) {
        Specification<Course> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), searchPattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchPattern)
                ));
            }

            if (categoryId != null) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("id"), categoryId));
            }

            if (status != null && !status.isBlank()) {
                try {
                    Course.Status courseStatus = Course.Status.valueOf(status.trim().toUpperCase());
                    predicates.add(criteriaBuilder.equal(root.get("status"), courseStatus));
                } catch (IllegalArgumentException ignored) {}
            }

            if (instructorId != null) {
                predicates.add(criteriaBuilder.equal(root.get("instructor").get("id"), instructorId));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        return courseRepository.findAll(spec).stream()
            .map(this::mapToCourseResponse)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CourseResponse getCourseById(Long id) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        return mapToCourseResponse(course);
    }

    @Transactional
    public CourseResponse createCourse(CourseCreateRequest request, UserPrincipal currentUser) {
        User instructor = userRepository.findById(currentUser.getId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (currentUser.getRole() != User.Role.INSTRUCTOR && currentUser.getRole() != User.Role.ADMIN) {
            throw new ForbiddenException("Only instructors or administrators can create courses");
        }

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
        }

        Course.Status status = Course.Status.DRAFT;
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            try {
                status = Course.Status.valueOf(request.getStatus().trim().toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        Course course = new Course(
            null,
            request.getTitle().trim(),
            request.getDescription(),
            category,
            instructor,
            status
        );
        course.setThumbnailUrl(request.getThumbnailUrl());

        Course saved = courseRepository.save(course);
        return mapToCourseResponse(saved);
    }

    @Transactional
    public CourseResponse updateCourse(Long id, CourseUpdateRequest request, UserPrincipal currentUser) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        validateCourseOwnership(course, currentUser);

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            course.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            course.setDescription(request.getDescription());
        }
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
            course.setCategory(category);
        }
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            try {
                course.setStatus(Course.Status.valueOf(request.getStatus().trim().toUpperCase()));
            } catch (IllegalArgumentException ignored) {}
        }
        if (request.getThumbnailUrl() != null) {
            course.setThumbnailUrl(request.getThumbnailUrl());
        }

        Course updated = courseRepository.save(course);
        return mapToCourseResponse(updated);
    }

    @Transactional
    public void deleteCourse(Long id, UserPrincipal currentUser) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        validateCourseOwnership(course, currentUser);
        courseRepository.delete(course);
    }

    public void validateCourseOwnership(Course course, UserPrincipal currentUser) {
        if (currentUser.getRole() == User.Role.ADMIN) {
            return;
        }
        if (currentUser.getRole() != User.Role.INSTRUCTOR || !course.getInstructor().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You do not have permission to modify this course");
        }
    }

    public Course getEntityById(Long id) {
        return courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
    }

    private CourseResponse mapToCourseResponse(Course course) {
        long totalLessons = lessonRepository.countByCourseId(course.getId());
        long totalEnrolled = enrollmentRepository.countByCourseId(course.getId());
        return CourseResponse.fromEntity(course, totalLessons, totalEnrolled);
    }
}
