package com.example.lms.service;

import com.example.lms.dto.request.LessonCreateRequest;
import com.example.lms.dto.request.LessonUpdateRequest;
import com.example.lms.dto.response.LessonResponse;
import com.example.lms.entity.Course;
import com.example.lms.entity.Lesson;
import com.example.lms.entity.Progress;
import com.example.lms.exception.ForbiddenException;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.repository.CourseRepository;
import com.example.lms.repository.LessonRepository;
import com.example.lms.repository.ProgressRepository;
import com.example.lms.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LessonService {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final ProgressRepository progressRepository;
    private final CourseService courseService;

    public LessonService(LessonRepository lessonRepository,
                         CourseRepository courseRepository,
                         ProgressRepository progressRepository,
                         CourseService courseService) {
        this.lessonRepository = lessonRepository;
        this.courseRepository = courseRepository;
        this.progressRepository = progressRepository;
        this.courseService = courseService;
    }

    @Transactional(readOnly = true)
    public List<LessonResponse> getLessonsByCourseId(Long courseId, UserPrincipal currentUser) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }

        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
        return lessons.stream().map(lesson -> {
            boolean completed = false;
            if (currentUser != null) {
                Optional<Progress> progress = progressRepository.findByUserIdAndLessonId(currentUser.getId(), lesson.getId());
                completed = progress.map(Progress::getCompleted).orElse(false);
            }
            return LessonResponse.fromEntity(lesson, completed);
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LessonResponse getLessonById(Long lessonId, UserPrincipal currentUser) {
        Lesson lesson = lessonRepository.findById(lessonId)
            .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        boolean completed = false;
        if (currentUser != null) {
            Optional<Progress> progress = progressRepository.findByUserIdAndLessonId(currentUser.getId(), lesson.getId());
            completed = progress.map(Progress::getCompleted).orElse(false);
        }
        return LessonResponse.fromEntity(lesson, completed);
    }

    @Transactional
    public LessonResponse createLesson(Long courseId, LessonCreateRequest request, UserPrincipal currentUser) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        courseService.validateCourseOwnership(course, currentUser);

        int orderIndex = request.getOrderIndex() != null ? request.getOrderIndex() : (int) lessonRepository.countByCourseId(courseId) + 1;
        int duration = request.getDurationMinutes() != null ? request.getDurationMinutes() : 0;

        Lesson lesson = new Lesson(
            null,
            course,
            request.getTitle().trim(),
            request.getDescription(),
            request.getContentUrl(),
            request.getContentText(),
            orderIndex,
            duration
        );

        Lesson saved = lessonRepository.save(lesson);
        return LessonResponse.fromEntity(saved, false);
    }

    @Transactional
    public LessonResponse updateLesson(Long lessonId, LessonUpdateRequest request, UserPrincipal currentUser) {
        Lesson lesson = lessonRepository.findById(lessonId)
            .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        courseService.validateCourseOwnership(lesson.getCourse(), currentUser);

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            lesson.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            lesson.setDescription(request.getDescription());
        }
        if (request.getContentUrl() != null) {
            lesson.setContentUrl(request.getContentUrl());
        }
        if (request.getContentText() != null) {
            lesson.setContentText(request.getContentText());
        }
        if (request.getOrderIndex() != null) {
            lesson.setOrderIndex(request.getOrderIndex());
        }
        if (request.getDurationMinutes() != null) {
            lesson.setDurationMinutes(request.getDurationMinutes());
        }

        Lesson updated = lessonRepository.save(lesson);
        return LessonResponse.fromEntity(updated, false);
    }

    @Transactional
    public void deleteLesson(Long lessonId, UserPrincipal currentUser) {
        Lesson lesson = lessonRepository.findById(lessonId)
            .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        courseService.validateCourseOwnership(lesson.getCourse(), currentUser);
        lessonRepository.delete(lesson);
    }

    public Lesson getEntityById(Long id) {
        return lessonRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + id));
    }
}
