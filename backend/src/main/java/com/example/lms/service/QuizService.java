package com.example.lms.service;

import com.example.lms.dto.request.QuestionCreateRequest;
import com.example.lms.dto.request.QuizCreateRequest;
import com.example.lms.dto.request.QuizSubmissionRequest;
import com.example.lms.dto.request.QuizUpdateRequest;
import com.example.lms.dto.response.QuizAttemptResponse;
import com.example.lms.dto.response.QuizResponse;
import com.example.lms.entity.*;
import com.example.lms.exception.BadRequestException;
import com.example.lms.exception.ForbiddenException;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.repository.*;
import com.example.lms.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final QuizAttemptAnswerRepository quizAttemptAnswerRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CourseService courseService;

    public QuizService(QuizRepository quizRepository,
                       QuestionRepository questionRepository,
                       QuizAttemptRepository quizAttemptRepository,
                       QuizAttemptAnswerRepository quizAttemptAnswerRepository,
                       CourseRepository courseRepository,
                       UserRepository userRepository,
                       CourseService courseService) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.quizAttemptAnswerRepository = quizAttemptAnswerRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.courseService = courseService;
    }

    @Transactional(readOnly = true)
    public List<QuizResponse> getQuizzesByCourseId(Long courseId, UserPrincipal currentUser) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }

        boolean includeAnswers = currentUser != null && (currentUser.getRole() == User.Role.INSTRUCTOR || currentUser.getRole() == User.Role.ADMIN);
        List<Quiz> quizzes = quizRepository.findByCourseId(courseId);

        return quizzes.stream()
            .map(q -> QuizResponse.fromEntity(q, includeAnswers))
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public QuizResponse getQuizById(Long quizId, UserPrincipal currentUser) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));

        boolean includeAnswers = currentUser != null && (currentUser.getRole() == User.Role.INSTRUCTOR || currentUser.getRole() == User.Role.ADMIN);
        return QuizResponse.fromEntity(quiz, includeAnswers);
    }

    @Transactional
    public QuizResponse createQuiz(Long courseId, QuizCreateRequest request, UserPrincipal currentUser) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        courseService.validateCourseOwnership(course, currentUser);

        Quiz quiz = new Quiz(
            null,
            course,
            request.getTitle().trim(),
            request.getDescription(),
            request.getPassingScore() != null ? request.getPassingScore() : 70,
            request.getTimeLimitMinutes() != null ? request.getTimeLimitMinutes() : 30
        );

        if (request.getQuestions() != null) {
            for (QuestionCreateRequest qReq : request.getQuestions()) {
                Question question = new Question(
                    null,
                    quiz,
                    qReq.getQuestionText().trim(),
                    qReq.getOptionA().trim(),
                    qReq.getOptionB().trim(),
                    qReq.getOptionC().trim(),
                    qReq.getOptionD().trim(),
                    qReq.getCorrectOption().trim().toUpperCase(),
                    qReq.getPoints() != null ? qReq.getPoints() : 10,
                    qReq.getExplanation()
                );
                quiz.addQuestion(question);
            }
        }

        Quiz saved = quizRepository.save(quiz);
        return QuizResponse.fromEntity(saved, true);
    }

    @Transactional
    public QuizResponse updateQuiz(Long quizId, QuizUpdateRequest request, UserPrincipal currentUser) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));

        courseService.validateCourseOwnership(quiz.getCourse(), currentUser);

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            quiz.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            quiz.setDescription(request.getDescription());
        }
        if (request.getPassingScore() != null) {
            quiz.setPassingScore(request.getPassingScore());
        }
        if (request.getTimeLimitMinutes() != null) {
            quiz.setTimeLimitMinutes(request.getTimeLimitMinutes());
        }

        Quiz updated = quizRepository.save(quiz);
        return QuizResponse.fromEntity(updated, true);
    }

    @Transactional
    public void deleteQuiz(Long quizId, UserPrincipal currentUser) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));

        courseService.validateCourseOwnership(quiz.getCourse(), currentUser);
        quizRepository.delete(quiz);
    }

    @Transactional
    public QuizAttemptResponse submitQuiz(Long quizId, QuizSubmissionRequest request, UserPrincipal currentUser) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));

        User user = userRepository.findById(currentUser.getId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Question> questions = questionRepository.findByQuizId(quizId);
        if (questions.isEmpty()) {
            throw new BadRequestException("This quiz currently has no questions to evaluate");
        }

        Map<Long, Question> questionMap = new HashMap<>();
        for (Question q : questions) {
            questionMap.put(q.getId(), q);
        }

        int totalPossiblePoints = 0;
        int earnedScore = 0;

        QuizAttempt attempt = new QuizAttempt(null, quiz, user, 0, 0, false);
        attempt.setStartedAt(LocalDateTime.now().minusMinutes(5));
        attempt.setSubmittedAt(LocalDateTime.now());
        QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);

        for (QuizSubmissionRequest.AnswerSubmission submission : request.getAnswers()) {
            Question question = questionMap.get(submission.getQuestionId());
            if (question == null) {
                continue;
            }

            int questionPoints = question.getPoints() != null ? question.getPoints() : 10;
            totalPossiblePoints += questionPoints;

            boolean isCorrect = question.getCorrectOption().equalsIgnoreCase(submission.getSelectedOption().trim());
            int pointsAwarded = isCorrect ? questionPoints : 0;
            if (isCorrect) {
                earnedScore += pointsAwarded;
            }

            QuizAttemptAnswer attemptAnswer = new QuizAttemptAnswer(
                null,
                savedAttempt,
                question,
                submission.getSelectedOption().trim().toUpperCase(),
                isCorrect,
                pointsAwarded
            );
            quizAttemptAnswerRepository.save(attemptAnswer);
            savedAttempt.addAnswer(attemptAnswer);
        }

        // Check passing condition (e.g. score percentage >= quiz passing score)
        double scorePercentage = totalPossiblePoints > 0 ? ((double) earnedScore / totalPossiblePoints) * 100.0 : 0.0;
        boolean passed = scorePercentage >= quiz.getPassingScore();

        savedAttempt.setScore(earnedScore);
        savedAttempt.setTotalPoints(totalPossiblePoints);
        savedAttempt.setPassed(passed);

        QuizAttempt updatedAttempt = quizAttemptRepository.save(savedAttempt);
        return QuizAttemptResponse.fromEntity(updatedAttempt);
    }

    @Transactional(readOnly = true)
    public List<QuizAttemptResponse> getQuizResults(Long quizId, UserPrincipal currentUser) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));

        List<QuizAttempt> attempts;
        if (currentUser.getRole() == User.Role.ADMIN ||
            (currentUser.getRole() == User.Role.INSTRUCTOR && quiz.getCourse().getInstructor().getId().equals(currentUser.getId()))) {
            attempts = quizAttemptRepository.findByQuizId(quizId);
        } else {
            attempts = quizAttemptRepository.findByQuizIdAndUserId(quizId, currentUser.getId());
        }

        return attempts.stream()
            .map(QuizAttemptResponse::fromEntity)
            .collect(Collectors.toList());
    }
}
