package com.example.lms.service;

import com.example.lms.dto.request.DiscussionCreateRequest;
import com.example.lms.dto.request.DiscussionReplyRequest;
import com.example.lms.dto.response.DiscussionResponse;
import com.example.lms.entity.Course;
import com.example.lms.entity.Discussion;
import com.example.lms.entity.User;
import com.example.lms.exception.ForbiddenException;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.repository.CourseRepository;
import com.example.lms.repository.DiscussionRepository;
import com.example.lms.repository.UserRepository;
import com.example.lms.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DiscussionService {

    private final DiscussionRepository discussionRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public DiscussionService(DiscussionRepository discussionRepository,
                             CourseRepository courseRepository,
                             UserRepository userRepository) {
        this.discussionRepository = discussionRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<DiscussionResponse> getCourseDiscussions(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }

        List<Discussion> topLevelDiscussions = discussionRepository.findByCourseIdAndParentIsNullOrderByCreatedAtDesc(courseId);
        return topLevelDiscussions.stream()
            .map(DiscussionResponse::fromEntity)
            .collect(Collectors.toList());
    }

    @Transactional
    public DiscussionResponse createDiscussion(Long courseId, DiscussionCreateRequest request, UserPrincipal currentUser) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        User user = userRepository.findById(currentUser.getId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Discussion discussion = new Discussion(
            null,
            course,
            user,
            null,
            request.getTitle(),
            request.getContent().trim()
        );

        Discussion saved = discussionRepository.save(discussion);
        return DiscussionResponse.fromEntity(saved);
    }

    @Transactional
    public DiscussionResponse replyToDiscussion(Long discussionId, DiscussionReplyRequest request, UserPrincipal currentUser) {
        Discussion parent = discussionRepository.findById(discussionId)
            .orElseThrow(() -> new ResourceNotFoundException("Discussion thread not found with id: " + discussionId));

        User user = userRepository.findById(currentUser.getId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Discussion reply = new Discussion(
            null,
            parent.getCourse(),
            user,
            parent,
            null,
            request.getContent().trim()
        );

        Discussion saved = discussionRepository.save(reply);
        return DiscussionResponse.fromEntity(saved);
    }

    @Transactional
    public void deleteDiscussion(Long discussionId, UserPrincipal currentUser) {
        Discussion discussion = discussionRepository.findById(discussionId)
            .orElseThrow(() -> new ResourceNotFoundException("Discussion not found with id: " + discussionId));

        // Check ownership or admin privilege
        if (!discussion.getUser().getId().equals(currentUser.getId()) && currentUser.getRole() != User.Role.ADMIN) {
            throw new ForbiddenException("You are not authorized to delete this discussion");
        }

        discussionRepository.delete(discussion);
    }
}
