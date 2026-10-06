package com.example.lms.service;

import com.example.lms.dto.request.QuizSubmissionRequest;
import com.example.lms.dto.response.QuizAttemptResponse;
import com.example.lms.entity.Course;
import com.example.lms.entity.Question;
import com.example.lms.entity.Quiz;
import com.example.lms.entity.QuizAttempt;
import com.example.lms.entity.QuizAttemptAnswer;
import com.example.lms.entity.User;
import com.example.lms.repository.CourseRepository;
import com.example.lms.repository.QuestionRepository;
import com.example.lms.repository.QuizAttemptAnswerRepository;
import com.example.lms.repository.QuizAttemptRepository;
import com.example.lms.repository.QuizRepository;
import com.example.lms.repository.UserRepository;
import com.example.lms.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuizServiceTest {

    @Mock
    private QuizRepository quizRepository;
    @Mock
    private QuestionRepository questionRepository;
    @Mock
    private QuizAttemptRepository quizAttemptRepository;
    @Mock
    private QuizAttemptAnswerRepository quizAttemptAnswerRepository;
    @Mock
    private CourseRepository courseRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private CourseService courseService;

    @InjectMocks
    private QuizService quizService;

    private User learner;
    private Course course;
    private Quiz quiz;
    private Question question1;
    private Question question2;
    private UserPrincipal learnerPrincipal;

    @BeforeEach
    void setUp() {
        learner = new User(10L, "Learner", "learner@test.com", "pass", User.Role.LEARNER);
        course = new Course(1L, "Course", "Desc", null, null, Course.Status.PUBLISHED);
        quiz = new Quiz(1L, course, "Quiz 1", "Desc", 70, 30);

        question1 = new Question(1L, quiz, "Q1", "A", "B", "C", "D", "B", 10, "Exp 1");
        question2 = new Question(2L, quiz, "Q2", "A", "B", "C", "D", "C", 10, "Exp 2");

        learnerPrincipal = new UserPrincipal(10L, "Learner", "learner@test.com", "pass", User.Role.LEARNER,
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_LEARNER")));
    }

    @Test
    void submitQuiz_EvaluatesCorrectly_Passed() {
        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));
        when(userRepository.findById(10L)).thenReturn(Optional.of(learner));
        when(questionRepository.findByQuizId(1L)).thenReturn(Arrays.asList(question1, question2));

        QuizAttempt attempt = new QuizAttempt(100L, quiz, learner, 0, 0, false);
        when(quizAttemptRepository.save(any(QuizAttempt.class))).thenReturn(attempt);

        QuizSubmissionRequest submission = new QuizSubmissionRequest(Arrays.asList(
            new QuizSubmissionRequest.AnswerSubmission(1L, "B"), // Correct (+10)
            new QuizSubmissionRequest.AnswerSubmission(2L, "C")  // Correct (+10)
        ));

        QuizAttemptResponse response = quizService.submitQuiz(1L, submission, learnerPrincipal);

        assertNotNull(response);
        assertEquals(20, response.getScore());
        assertEquals(20, response.getTotalPoints());
        assertEquals(100.0, response.getPercentage());
        assertTrue(response.getPassed());
        verify(quizAttemptAnswerRepository, times(2)).save(any(QuizAttemptAnswer.class));
    }

    @Test
    void submitQuiz_EvaluatesCorrectly_Failed() {
        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));
        when(userRepository.findById(10L)).thenReturn(Optional.of(learner));
        when(questionRepository.findByQuizId(1L)).thenReturn(Arrays.asList(question1, question2));

        QuizAttempt attempt = new QuizAttempt(100L, quiz, learner, 0, 0, false);
        when(quizAttemptRepository.save(any(QuizAttempt.class))).thenReturn(attempt);

        QuizSubmissionRequest submission = new QuizSubmissionRequest(Arrays.asList(
            new QuizSubmissionRequest.AnswerSubmission(1L, "A"), // Wrong (0)
            new QuizSubmissionRequest.AnswerSubmission(2L, "C")  // Correct (+10)
        ));

        QuizAttemptResponse response = quizService.submitQuiz(1L, submission, learnerPrincipal);

        assertNotNull(response);
        assertEquals(10, response.getScore());
        assertEquals(20, response.getTotalPoints());
        assertEquals(50.0, response.getPercentage());
        assertFalse(response.getPassed()); // 50% < 70% passing score
    }
}
