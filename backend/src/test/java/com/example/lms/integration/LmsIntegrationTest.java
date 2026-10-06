package com.example.lms.integration;

import com.example.lms.dto.request.*;
import com.example.lms.dto.response.*;
import com.example.lms.service.*;
import com.example.lms.security.UserPrincipal;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class LmsIntegrationTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private CourseService courseService;

    @Autowired
    private LessonService lessonService;

    @Autowired
    private QuizService quizService;

    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private ProgressService progressService;

    @Autowired
    private CertificateService certificateService;

    @Autowired
    private DiscussionService discussionService;

    @Autowired
    private FeedbackService feedbackService;

    @Test
    @Order(1)
    void completeLearningLifecycle_EndToEndFlow() {
        // 1. Register and login Instructor
        RegisterRequest instructorReg = new RegisterRequest("Instructor Bob", "bob@lms.com", "password123", "INSTRUCTOR");
        AuthResponse instructorAuth = authService.register(instructorReg);
        assertNotNull(instructorAuth.getToken());
        UserPrincipal instructorPrincipal = new UserPrincipal(instructorAuth.getUser().getId(), "Instructor Bob", "bob@lms.com", "pass", com.example.lms.entity.User.Role.INSTRUCTOR, Collections.emptyList());

        // 2. Instructor creates a Course
        CourseCreateRequest courseReq = new CourseCreateRequest("Full Stack React & Spring", "Complete guide", null, "PUBLISHED", "http://thumb.jpg");
        CourseResponse course = courseService.createCourse(courseReq, instructorPrincipal);
        assertNotNull(course.getId());
        assertEquals("Full Stack React & Spring", course.getTitle());

        // 3. Instructor adds Lessons
        LessonCreateRequest lesson1Req = new LessonCreateRequest("Lesson 1: Introduction", "Overview", "http://video1.mp4", "Content text 1", 1, 10);
        LessonResponse lesson1 = lessonService.createLesson(course.getId(), lesson1Req, instructorPrincipal);
        assertNotNull(lesson1.getId());

        LessonCreateRequest lesson2Req = new LessonCreateRequest("Lesson 2: Architecture", "Deep dive", "http://video2.mp4", "Content text 2", 2, 20);
        LessonResponse lesson2 = lessonService.createLesson(course.getId(), lesson2Req, instructorPrincipal);
        assertNotNull(lesson2.getId());

        // 4. Instructor creates a Quiz with questions
        QuestionCreateRequest q1 = new QuestionCreateRequest("What is Spring Boot?", "Tool", "Framework", "OS", "Browser", "B", 10, "Spring is a framework");
        QuestionCreateRequest q2 = new QuestionCreateRequest("What is React?", "Library", "Database", "Server", "Protocol", "A", 10, "React is a UI library");

        QuizCreateRequest quizReq = new QuizCreateRequest("Final Certification Quiz", "Test your knowledge", 70, 20, Arrays.asList(q1, q2));
        QuizResponse quiz = quizService.createQuiz(course.getId(), quizReq, instructorPrincipal);
        assertNotNull(quiz.getId());
        assertEquals(2, quiz.getTotalQuestions());

        // 5. Register and login Learner
        RegisterRequest learnerReg = new RegisterRequest("Learner Alice", "alice@lms.com", "password123", "LEARNER");
        AuthResponse learnerAuth = authService.register(learnerReg);
        assertNotNull(learnerAuth.getToken());
        UserPrincipal learnerPrincipal = new UserPrincipal(learnerAuth.getUser().getId(), "Learner Alice", "alice@lms.com", "pass", com.example.lms.entity.User.Role.LEARNER, Collections.emptyList());

        // 6. Learner enrolls in course
        EnrollmentResponse enrollment = enrollmentService.enroll(course.getId(), null, learnerPrincipal);
        assertNotNull(enrollment.getId());
        assertEquals("ENROLLED", enrollment.getStatus());

        // 7. Learner completes lessons & tracks progress
        ProgressUpdateRequest prog1 = new ProgressUpdateRequest(true, 600, 100.0);
        ProgressResponse pr1 = progressService.updateLessonProgress(lesson1.getId(), prog1, learnerPrincipal);
        assertTrue(pr1.getCompleted());

        ProgressUpdateRequest prog2 = new ProgressUpdateRequest(true, 1200, 100.0);
        ProgressResponse pr2 = progressService.updateLessonProgress(lesson2.getId(), prog2, learnerPrincipal);
        assertTrue(pr2.getCompleted());

        CourseProgressResponse courseProg = progressService.getCourseProgress(course.getId(), learnerPrincipal);
        assertEquals(2L, courseProg.getCompletedLessons());
        assertEquals(100.0, courseProg.getOverallProgressPercentage());
        assertTrue(courseProg.getCourseCompleted());

        // 8. Learner submits Quiz answers and passes
        QuizSubmissionRequest quizSub = new QuizSubmissionRequest(Arrays.asList(
            new QuizSubmissionRequest.AnswerSubmission(quiz.getQuestions().get(0).getId(), "B"),
            new QuizSubmissionRequest.AnswerSubmission(quiz.getQuestions().get(1).getId(), "A")
        ));
        QuizAttemptResponse attempt = quizService.submitQuiz(quiz.getId(), quizSub, learnerPrincipal);
        assertEquals(20, attempt.getScore());
        assertEquals(20, attempt.getTotalPoints());
        assertTrue(attempt.getPassed());

        // 9. Learner generates Certificate
        CertificateResponse cert = certificateService.generateCertificate(course.getId(), learnerPrincipal);
        assertNotNull(cert.getCertificateCode());
        assertEquals(course.getId(), cert.getCourseId());
        assertEquals(learnerPrincipal.getId(), cert.getUserId());

        // 10. Learner posts Discussion and Feedback
        DiscussionCreateRequest discReq = new DiscussionCreateRequest("Great Course", "I enjoyed the modules");
        DiscussionResponse disc = discussionService.createDiscussion(course.getId(), discReq, learnerPrincipal);
        assertNotNull(disc.getId());

        DiscussionReplyRequest replyReq = new DiscussionReplyRequest("Glad you enjoyed it!");
        DiscussionResponse reply = discussionService.replyToDiscussion(disc.getId(), replyReq, instructorPrincipal);
        assertNotNull(reply.getId());

        FeedbackRequest fbReq = new FeedbackRequest(5, "Excellent learning experience!");
        FeedbackResponse feedback = feedbackService.submitFeedback(course.getId(), fbReq, learnerPrincipal);
        assertNotNull(feedback.getId());
        assertEquals(5, feedback.getRating());
    }
}
