# Learning Management System — Engineering Contract v1.0

**Document status:** Final engineering contract  
**Release:** v1.0  
**Project:** Learning Management System  
**Workstreams:** 2  
**Primary contributors:** Jay (Frontend), Ali (Backend)

---

# 0. Contract Purpose

This contract defines the technical ownership, development boundaries, integration rules, naming conventions, testing requirements, Git workflow, and Definition of Done for the Learning Management System.

The purpose is to prevent:

- frontend/backend conflicts
- duplicated implementation
- undocumented API changes
- database conflicts
- accidental changes to another contributor's work
- inconsistent naming
- unfinished integration
- "it works on my machine" engineering, humanity's most enduring contribution to software development

This document is the engineering source of truth for the project.

---

# 1. Project Objective

The Learning Management System is a full-stack web application designed to provide a centralized platform for:

```text
User Registration
       ↓
Authentication
       ↓
Course Discovery
       ↓
Course Enrollment
       ↓
Learning Content
       ↓
Progress Tracking
       ↓
Assessments
       ↓
Performance Evaluation
       ↓
Course Completion
       ↓
Certificate
```

The system supports three primary roles:

```text
Learner
Instructor
Administrator
```

The platform should provide secure authentication, role-based access, course management, learning progress, assessments, discussions, feedback, certificates, and administrative functionality.

---

# 2. Technology Baseline

Unless formally changed through the Change Management section, the planned technology baseline is:

| Layer | Technology |
|---|---|
| Frontend | React |
| Styling | Tailwind CSS |
| UI Components | Ant Design |
| Backend | Spring Boot |
| Language | Java |
| API | REST |
| Security | Spring Security + JWT |
| ORM | Spring Data JPA / Hibernate |
| Database | MySQL |
| Build Tool | Maven |
| API Documentation | Swagger / OpenAPI |
| Version Control | Git + GitHub |

The technology baseline is the intended project stack. Any major technology replacement requires agreement from both contributors.

---

# 3. Workstream Ownership

## 3.1 Workstream A — Frontend

**Primary:** Jay  
**Backup:** Ali

### Owned responsibilities

Jay is responsible for:

- React application architecture
- Application shell
- Navigation
- Routing
- Authentication screens
- Registration UI
- Login UI
- Learner dashboard
- Instructor dashboard
- Admin dashboard UI
- Course catalogue
- Course detail pages
- Course enrollment UI
- Learning interface
- Lesson navigation
- Video/content player interface
- Progress visualization
- Quiz and assessment interface
- Quiz result interface
- Question-bank management UI
- Discussion UI
- Feedback and rating UI
- Certificate viewing/download UI
- API integration
- Frontend state management
- Reusable components
- Form validation
- Loading states
- Empty states
- Error states
- Responsive behavior
- Accessibility
- Frontend tests
- End-to-end browser tests
- Frontend build and linting

### Primary directory

```text
frontend/
```

### Frontend may modify

```text
frontend/**
```

and frontend-specific configuration files.

### Frontend must not modify

```text
backend/**
database/**
```

Backend Java files, JPA entities, repositories, services, controllers, database migrations, or backend configuration must not be modified by Jay.

If a frontend requirement needs a backend change, Jay documents the required API behavior and raises it to Ali rather than editing backend files directly.

---

# 3.2 Workstream B — Backend

**Primary:** Ali  
**Backup:** Jay

### Owned responsibilities

Ali is responsible for:

- Backend architecture
- Database design
- JPA entities
- Repositories
- Services
- Controllers
- DTOs
- Validation
- REST APIs
- Authentication
- JWT implementation
- Role-based authorization
- User management
- Course management
- Lesson management APIs
- Enrollment APIs
- Progress tracking APIs
- Quiz APIs
- Question-bank APIs
- Result and performance APIs
- Discussion APIs
- Feedback APIs
- Certificate generation
- Administrative APIs
- Database migrations
- Backend configuration
- Environment variables
- Swagger/OpenAPI documentation
- Backend logging
- Backend error handling
- Backend unit tests
- Backend integration tests

### Primary directories

```text
backend/
database/
```

### Backend may modify

```text
backend/**
database/**
```

and backend-specific configuration files.

### Backend must not modify

```text
frontend/**
```

Frontend components, pages, hooks, styling, routes, and frontend state must not be modified by Ali.

If a backend API change requires frontend work, Ali documents the API contract and notifies Jay rather than modifying frontend files.

---

# 4. Cross-Workstream Conflict Prevention

## 4.1 API Contract Gate

Before frontend integration begins for a new feature, the backend must define:

1. endpoint path
2. HTTP method
3. request body
4. response body
5. authentication requirements
6. authorization requirements
7. validation rules
8. error responses

Example:

```http
POST /api/v1/courses/{courseId}/enroll
```

Request:

```json
{
  "userId": "uuid"
}
```

Response:

```json
{
  "enrollmentId": "uuid",
  "courseId": "uuid",
  "status": "ENROLLED",
  "enrolledAt": "datetime"
}
```

The frontend must consume the agreed contract.

It must not invent endpoint paths or request/response fields.

---

# 4.2 Database Ownership Gate

The database schema is owned exclusively by the Backend workstream.

Ali is responsible for:

- entity definitions
- table structure
- relationships
- indexes
- constraints
- migration files
- seed data where applicable

Jay must not directly modify:

```text
database/**
backend/*/entity/**
backend/*/repository/**
```

If Jay identifies a missing database field, the requirement must be documented and implemented by Ali.

---

# 4.3 Environment Variable Contract

Backend-owned environment variables must be:

1. defined in backend configuration
2. documented in `.env.example`
3. used consistently throughout the backend

Example:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
JWT_EXPIRATION
```

No code may reference an undocumented environment variable.

Frontend environment variables must also be documented before being used.

Example:

```text
VITE_API_BASE_URL
```

or the equivalent variable defined by the actual frontend configuration.

---

# 4.4 Shared File Protection

The following files are considered cross-workstream files:

```text
README.md
CONTRACT.md
.gitignore
.env.example
docker-compose.yml
```

Changes to these files require the other contributor to review the change before merge.

Neither contributor should make unrelated edits to these files.

---

# 4.5 Integration Gate

A feature is not considered complete when only one side works.

The feature must successfully pass:

```text
Database
   ↓
Backend API
   ↓
Frontend API Module
   ↓
Frontend Component
   ↓
User Interaction
   ↓
Persisted Result
```

A feature that works in Swagger but not in the React application is incomplete.

A frontend page using mock data instead of the real API is also incomplete unless that mock is explicitly being used during isolated frontend development.

---

# 5. Scope

## 5.1 Included

### Authentication

- User registration
- User login
- Logout
- JWT authentication
- Password hashing
- Protected routes
- Role-based authorization

### Learner Features

- Course browsing
- Course search/filtering
- Course details
- Course enrollment
- Course unenrollment where supported
- Lesson access
- Learning content
- Progress tracking
- Quiz participation
- Result viewing
- Discussion participation
- Course feedback
- Learning history
- Certificate generation/download

### Instructor Features

- Course creation
- Course editing
- Course publishing
- Course deletion
- Lesson management
- Learning material management
- Question-bank management
- Quiz creation
- Learner performance viewing
- Course discussion management

### Administrator Features

- User management
- Instructor management
- Course management
- Category management
- Assessment/question management
- Performance monitoring
- Platform-level administration

---

# 5.2 Explicitly Excluded from v1.0

The following are not required unless both contributors explicitly add them to the contract:

- payment gateway
- subscription billing
- live video classes
- real-time classroom streaming
- mobile application
- AI course recommendations
- AI tutoring
- plagiarism detection
- advanced proctoring
- biometric authentication
- blockchain certificates
- social media integration
- enterprise SSO
- multi-tenant deployment
- offline-first operation

Future functionality must not be implemented casually outside the agreed scope.

---

# 6. User Role Contract

## 6.1 Learner

Learners may:

- register
- log in
- browse courses
- view course details
- enroll
- access enrolled content
- track progress
- complete assessments
- view results
- participate in discussions
- submit feedback
- view learning history
- obtain certificates

Learners must not:

- create courses
- modify other users
- modify administrative settings
- modify question banks unless explicitly authorized

---

## 6.2 Instructor

Instructors may:

- create courses
- update courses
- manage lessons
- manage learning materials
- create assessments
- manage questions
- view learner performance
- participate in course discussions

Instructors must not:

- manage system administrators
- modify unrelated users
- access another instructor's private resources unless authorized

---

## 6.3 Administrator

Administrators may:

- manage users
- manage instructors
- manage courses
- manage categories
- manage assessments
- monitor system activity
- access administrative dashboards

Administrative privilege must be enforced by the backend.

A hidden frontend button is not authorization.

---

# 7. Canonical Backend Structure

The backend should follow a layered architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Recommended structure:

```text
backend/
└── src/
    ├── main/
    │   ├── java/
    │   │   └── .../
    │   │       ├── config/
    │   │       ├── controller/
    │   │       ├── dto/
    │   │       ├── entity/
    │   │       ├── exception/
    │   │       ├── repository/
    │   │       ├── security/
    │   │       └── service/
    │   │
    │   └── resources/
    │       └── application.yml
    │
    └── test/
```

Controllers handle HTTP concerns.

Services contain business logic.

Repositories handle persistence.

Entities represent database structures.

DTOs represent API contracts.

Security components handle authentication and authorization.

---

# 8. Canonical Frontend Structure

The frontend should remain component-based and modular.

Recommended structure:

```text
frontend/
└── src/
    ├── api/
    ├── assets/
    ├── components/
    ├── context/
    ├── hooks/
    ├── layouts/
    ├── pages/
    ├── routes/
    ├── types/
    ├── utils/
    ├── App.jsx
    └── main.jsx
```

### Responsibilities

```text
pages/
    Application screens

components/
    Reusable UI

api/
    Backend communication

hooks/
    Reusable React logic

context/
    Shared application state

routes/
    Route definitions

utils/
    Shared helper functions
```

Business logic should not be unnecessarily duplicated inside page components.

---

# 9. Database Contract

The backend owns the database model.

The following are the canonical business entities for the LMS:

```text
User
Course
Category
Lesson
Enrollment
Progress
Quiz
Question
QuizAttempt
QuizResult
Discussion
Feedback
Certificate
```

The final implementation may normalize or combine some entities where technically justified, but the business concepts must remain clear.

---

## 9.1 User

Core user information includes:

```text
id
name
email
password
role
createdAt
updatedAt
```

Passwords must never be stored in plaintext.

---

## 9.2 Course

A course should support concepts such as:

```text
id
title
description
category
instructor
status
createdAt
updatedAt
```

---

## 9.3 Lesson

A lesson belongs to a course.

Example concepts:

```text
id
courseId
title
description
content/video reference
order
duration
```

---

## 9.4 Enrollment

Enrollment links a learner to a course.

```text
User
  │
  └── Enrollment ── Course
```

Duplicate active enrollments for the same learner and course should be prevented.

---

## 9.5 Progress

Progress tracks learner activity.

Possible fields:

```text
id
userId
courseId
lessonId
completionPercentage
watchTime
completed
updatedAt
```

The backend is the source of truth for persisted progress.

---

## 9.6 Assessment

Assessment functionality includes:

```text
Quiz
Question
QuizAttempt
QuizResult
```

The backend must validate submitted answers and calculate authoritative results.

The frontend must never be treated as the source of truth for scores.

---

# 10. API Contract

All APIs should use:

```text
/api/v1
```

unless this is formally changed.

---

## 10.1 Authentication Endpoints

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
```

---

## 10.2 User Endpoints

```http
GET    /api/v1/users/{id}
PUT    /api/v1/users/{id}
GET    /api/v1/users
```

Administrative restrictions apply where required.

---

## 10.3 Course Endpoints

```http
GET    /api/v1/courses
GET    /api/v1/courses/{id}
POST   /api/v1/courses
PUT    /api/v1/courses/{id}
DELETE /api/v1/courses/{id}
```

Creation and modification are restricted to authorized users.

---

## 10.4 Enrollment Endpoints

```http
POST   /api/v1/courses/{courseId}/enroll
DELETE /api/v1/courses/{courseId}/enroll
GET    /api/v1/users/{userId}/enrollments
```

---

## 10.5 Lesson Endpoints

```http
GET    /api/v1/courses/{courseId}/lessons
GET    /api/v1/lessons/{lessonId}
POST   /api/v1/courses/{courseId}/lessons
PUT    /api/v1/lessons/{lessonId}
DELETE /api/v1/lessons/{lessonId}
```

---

## 10.6 Progress Endpoints

```http
GET   /api/v1/courses/{courseId}/progress
POST  /api/v1/lessons/{lessonId}/progress
PATCH /api/v1/lessons/{lessonId}/progress
```

---

## 10.7 Assessment Endpoints

```http
GET    /api/v1/courses/{courseId}/quizzes
GET    /api/v1/quizzes/{quizId}
POST   /api/v1/quizzes/{quizId}/attempts
GET    /api/v1/quizzes/{quizId}/results
```

Instructor/admin operations:

```http
POST   /api/v1/courses/{courseId}/quizzes
PUT    /api/v1/quizzes/{quizId}
DELETE /api/v1/quizzes/{quizId}
```

---

## 10.8 Discussion Endpoints

```http
GET    /api/v1/courses/{courseId}/discussions
POST   /api/v1/courses/{courseId}/discussions
POST   /api/v1/discussions/{discussionId}/replies
DELETE /api/v1/discussions/{discussionId}
```

---

## 10.9 Feedback Endpoints

```http
GET  /api/v1/courses/{courseId}/feedback
POST /api/v1/courses/{courseId}/feedback
PUT  /api/v1/feedback/{feedbackId}
```

---

## 10.10 Certificate Endpoints

```http
GET  /api/v1/courses/{courseId}/certificate
POST /api/v1/courses/{courseId}/certificate
```

Certificate eligibility must be validated by the backend.

---

# 11. API Response Contract

Responses should remain consistent.

Example successful response:

```json
{
  "data": {},
  "message": "Success"
}
```

Example error response:

```json
{
  "error": {
    "code": "COURSE_NOT_FOUND",
    "message": "Course does not exist"
  }
}
```

The exact response wrapper may be simplified where unnecessary, but response shapes must not be changed casually after frontend integration.

---

# 12. Error Contract

Canonical errors should use meaningful error codes.

Example:

| HTTP Status | Code | Meaning |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Invalid request |
| 401 | `UNAUTHORIZED` | Authentication required |
| 403 | `FORBIDDEN` | User lacks permission |
| 404 | `RESOURCE_NOT_FOUND` | Requested resource does not exist |
| 409 | `RESOURCE_CONFLICT` | Duplicate/conflicting operation |
| 422 | `INVALID_OPERATION` | Request is syntactically valid but operation is not allowed |
| 500 | `INTERNAL_SERVER_ERROR` | Unexpected backend failure |

Internal stack traces, database details, credentials, and sensitive implementation details must never be returned to the client.

---

# 13. Authentication and Security Contract

Authentication is a backend responsibility.

The backend must:

- hash passwords securely
- validate credentials
- generate JWTs
- validate JWTs
- enforce token expiration
- enforce user roles
- protect restricted endpoints

Frontend responsibilities are limited to:

- login/register forms
- session handling
- authenticated API requests
- route protection for user experience
- displaying authorization-related states

Frontend route guards are not security boundaries.

---

# 14. Authorization Matrix

| Feature | Learner | Instructor | Admin |
|---|:---:|:---:|:---:|
| Browse courses | ✓ | ✓ | ✓ |
| View course | ✓ | ✓ | ✓ |
| Enroll | ✓ | — | ✓ |
| Access lessons | ✓ | ✓ | ✓ |
| Track own progress | ✓ | — | ✓ |
| Take quiz | ✓ | — | ✓ |
| View own results | ✓ | — | ✓ |
| Create course | — | ✓ | ✓ |
| Edit own course | — | ✓ | ✓ |
| Delete own course | — | ✓ | ✓ |
| Manage questions | — | ✓ | ✓ |
| View learner performance | — | ✓ | ✓ |
| Participate in discussions | ✓ | ✓ | ✓ |
| Submit feedback | ✓ | — | — |
| Manage users | — | — | ✓ |
| Manage instructors | — | — | ✓ |
| Manage all courses | — | — | ✓ |
| Access admin dashboard | — | — | ✓ |

Ownership checks must be performed by the backend.

---

# 15. Canonical Naming Contract

## 15.1 Backend

Use consistent Java naming:

```text
User
Course
Lesson
Enrollment
Progress
Quiz
Question
QuizAttempt
QuizResult
Discussion
Feedback
Certificate
```

Controllers:

```text
AuthController
UserController
CourseController
EnrollmentController
LessonController
ProgressController
QuizController
DiscussionController
FeedbackController
CertificateController
```

Services:

```text
AuthService
UserService
CourseService
EnrollmentService
LessonService
ProgressService
QuizService
DiscussionService
FeedbackService
CertificateService
```

Repositories:

```text
UserRepository
CourseRepository
LessonRepository
EnrollmentRepository
ProgressRepository
QuizRepository
QuestionRepository
QuizAttemptRepository
DiscussionRepository
FeedbackRepository
CertificateRepository
```

---

## 15.2 Frontend

Use consistent component naming:

```text
AppShell
Navbar
Sidebar
CourseCard
CourseList
CourseDetails
EnrollmentButton
LessonPlayer
ProgressBar
QuizCard
QuizPage
QuizResult
DiscussionList
DiscussionItem
FeedbackForm
CertificateCard
AdminDashboard
InstructorDashboard
LearnerDashboard
```

API modules should be feature-based:

```text
authApi
userApi
courseApi
enrollmentApi
lessonApi
progressApi
quizApi
discussionApi
feedbackApi
certificateApi
```

Do not create multiple names for the same concept.

For example:

```text
courseApi
```

should not coexist with:

```text
courseService
coursesApi
courseRequests
courseClient
```

unless there is a real architectural reason.

---

# 16. Frontend UI Contract

Every major page must provide appropriate states for:

```text
Loading
Success
Empty
Error
Retry
```

Example:

```text
Loading Course
      ↓
Course Loaded
      ↓
 ┌────┴─────┐
 ↓          ↓
Content     Error
 ↓          ↓
Success     Retry
```

The frontend must not silently display empty data when an API request failed.

---

# 17. Responsive Design Contract

The application must remain usable on:

```text
Desktop
Tablet
Mobile
```

At minimum:

- navigation must adapt to smaller screens
- cards must not overflow
- forms must remain usable
- tables should support responsive behavior
- text must remain readable
- buttons must remain accessible

Responsive behavior is part of feature completion, not decorative bonus material.

---

# 18. Testing Contract

## 18.1 Backend Tests

Ali must test:

- registration
- login
- invalid login
- JWT validation
- role authorization
- course creation
- course updates
- course deletion
- enrollment
- duplicate enrollment prevention
- lesson retrieval
- progress updates
- quiz submission
- result calculation
- question management
- discussion creation
- feedback submission
- certificate eligibility
- invalid IDs
- unauthorized access
- forbidden access
- validation errors

---

## 18.2 Frontend Tests

Jay must test:

- login form
- registration form
- route protection
- course catalogue
- course details
- enrollment interaction
- lesson navigation
- progress display
- quiz interaction
- result display
- discussion interface
- feedback interface
- certificate interface
- instructor pages
- admin pages
- loading states
- empty states
- error states
- responsive behavior where practical

---

# 19. Integration Testing

At least the following complete user flows must work.

## Scenario 1 — Registration and Login

```text
Register
  ↓
User created
  ↓
Login
  ↓
JWT returned
  ↓
Authenticated dashboard
```

---

## Scenario 2 — Course Enrollment

```text
Learner
  ↓
Browse Course
  ↓
Open Course
  ↓
Enroll
  ↓
Enrollment stored
  ↓
Course becomes accessible
```

---

## Scenario 3 — Learning Progress

```text
Open Course
  ↓
Open Lesson
  ↓
Consume Content
  ↓
Mark Lesson Complete
  ↓
Progress Updated
  ↓
Dashboard Reflects Progress
```

---

## Scenario 4 — Assessment

```text
Open Quiz
  ↓
Answer Questions
  ↓
Submit
  ↓
Backend Validates
  ↓
Score Calculated
  ↓
Result Stored
  ↓
Frontend Displays Result
```

---

## Scenario 5 — Certificate

```text
Complete Course
  ↓
Meet Completion Requirements
  ↓
Backend Verifies Eligibility
  ↓
Certificate Generated
  ↓
Learner Downloads Certificate
```

---

# 20. Backend Configuration Contract

Backend configuration should be centralized.

Example:

```text
application.yml
```

or the project's equivalent configuration file.

Sensitive values must be loaded from environment variables.

Never commit:

```text
DB_PASSWORD
JWT_SECRET
ADMIN_PASSWORD
API_SECRET
```

or other credentials.

---

# 21. Frontend Configuration Contract

The frontend must obtain the backend base URL through a configuration mechanism rather than scattering URLs throughout components.

Example:

```text
API_BASE_URL
```

All API modules must reference the same configured base URL.

Do not write:

```javascript
fetch("http://localhost:8080/api/...")
```

throughout random components.

That is how projects become archaeological sites.

---

# 22. Git and Branching Contract

## 22.1 Main Branch

The `main` branch is protected.

Neither contributor should develop directly on `main`.

Never:

```text
git push origin main
```

for normal feature development.

---

## 22.2 Branches

Recommended branches:

```text
frontend/lms-v1
backend/lms-v1
```

Feature-specific branches may be created beneath the workstream:

```text
frontend/course-ui
frontend/quiz-ui
frontend/dashboard-ui

backend/course-api
backend/auth-api
backend/quiz-api
backend/progress-api
```

---

# 23. Commit Contract

Commits should be focused.

Recommended format:

```text
feat(frontend): add course catalogue
feat(backend): add course CRUD APIs
fix(frontend): handle enrollment error state
fix(backend): prevent duplicate enrollment
test(frontend): add quiz component tests
test(backend): add enrollment integration tests
docs: update API documentation
```

Do not combine unrelated work into one commit.

Avoid commits such as:

```text
changes
final
final2
working
important changes
latest
```

Git deserves better.

---

# 24. Pull Request Contract

Every PR must include:

```text
Summary
Changes Made
Files Changed
Tests Run
Expected Behavior
Known Issues
```

Example:

```text
## Summary
Implemented course enrollment API.

## Changes
- Added Enrollment entity
- Added repository
- Added service
- Added POST /courses/{id}/enroll
- Added duplicate enrollment validation

## Tests
- Backend unit tests
- Enrollment integration test

## Known Issues
None
```

---

# 25. Cross-Workstream Review Rules

The following changes require review from both contributors:

```text
CONTRACT.md
README.md
.env.example
docker-compose.yml
API contracts
Database schema contracts
Authentication contract
Role/permission changes
Shared configuration
Major dependency changes
```

Neither contributor may silently alter a shared contract.

---

# 26. AI-Assisted Development Rules

Any AI coding agent used on the project must:

1. Read `CONTRACT.md` before modifying the repository.
2. Read `README.md` before implementing a feature.
3. Inspect the existing code before creating new files.
4. Work only on the assigned workstream.
5. Follow canonical naming.
6. Never invent an API without checking the contract.
7. Never modify excluded directories.
8. Never add credentials.
9. Never commit secrets.
10. Never force-push.
11. Never modify another contributor's branch.
12. Run appropriate tests after implementation.
13. Report changed files honestly.
14. Report failed tests honestly.
15. Report unfinished implementation honestly.

AI agents must not use "helpful" refactoring as an excuse to modify unrelated parts of the repository.

If a requirement is ambiguous, the implementation must not silently invent a completely different architecture.

---

# 27. Workstream Boundaries

## Jay — Frontend

```text
OWN:
frontend/**
```

Jay owns:

```text
UI
UX
React
Routing
Components
Pages
API integration
Frontend state
Validation UI
Loading/Error/Empty states
Responsive design
Frontend tests
E2E tests
```

Jay does not own:

```text
Database
JPA entities
Repositories
Services
Controllers
JWT implementation
Backend business logic
Backend migrations
```

---

## Ali — Backend

```text
OWN:
backend/**
database/**
```

Ali owns:

```text
Database
Entities
Repositories
Services
Controllers
DTOs
Authentication
Authorization
JWT
Business logic
REST APIs
Migrations
Validation
Backend tests
Swagger/OpenAPI
Backend configuration
```

Ali does not own:

```text
React components
Pages
Frontend styling
Frontend routing
Frontend state
Frontend layout
```

---

# 28. Feature Development Protocol

Every feature should follow:

```text
Requirement
    ↓
Contract Definition
    ↓
Backend Implementation
    ↓
Backend Tests
    ↓
API Verification
    ↓
Frontend Integration
    ↓
Frontend Tests
    ↓
End-to-End Test
    ↓
Pull Request
    ↓
Review
    ↓
Merge
```

For features that can be developed independently, Jay and Ali may work in parallel.

Example:

```text
             Feature
                │
        ┌───────┴────────┐
        ↓                ↓
   Backend API       Frontend UI
        ↓                ↓
   Backend Tests      Frontend Tests
        └───────┬────────┘
                ↓
           Integration
                ↓
             E2E Test
```

---

# 29. API Change Management

Changing any of the following requires agreement:

```text
Endpoint path
HTTP method
Request body
Response structure
Field name
Field type
Authentication requirement
Authorization requirement
Error code
Status code
Pagination behavior
```

Breaking an API after frontend integration without updating the other workstream is prohibited.

---

# 30. Database Change Management

Changes requiring explicit coordination include:

```text
Table names
Column names
Column types
Relationships
Foreign keys
Indexes
Constraints
Entity names
Migration strategy
```

Database changes must be accompanied by:

```text
Entity update
Migration
Backend test
API impact review
Frontend impact review
```

---

# 31. Dependency Change Management

Adding or upgrading major dependencies must be reviewed.

Examples:

```text
React
Spring Boot
Spring Security
Hibernate
MySQL driver
Tailwind CSS
Ant Design
JWT libraries
Testing frameworks
```

A dependency must not be added simply because an AI-generated solution used it.

---

# 32. Definition of Done

A feature is considered complete only when all relevant checks pass.

## Authentication

- [ ] Registration works
- [ ] Login works
- [ ] Logout works
- [ ] Passwords are securely hashed
- [ ] JWT authentication works
- [ ] Protected routes work
- [ ] Role authorization works
- [ ] Invalid authentication is handled correctly

---

## Course Management

- [ ] Course creation works
- [ ] Course editing works
- [ ] Course deletion works
- [ ] Course publishing works
- [ ] Course listing works
- [ ] Course details work
- [ ] Course ownership/permissions are enforced

---

## Enrollment

- [ ] Learner can enroll
- [ ] Duplicate enrollment is prevented
- [ ] Enrollment is persisted
- [ ] Enrolled courses are visible
- [ ] Unauthorized enrollment actions are rejected

---

## Learning

- [ ] Lessons load correctly
- [ ] Lesson navigation works
- [ ] Learning content loads
- [ ] Completion status is recorded
- [ ] Progress is persisted
- [ ] Progress is reflected in the frontend

---

## Assessments

- [ ] Quiz loads
- [ ] Questions load
- [ ] Answers can be submitted
- [ ] Backend calculates authoritative score
- [ ] Result is persisted
- [ ] Learner can view result
- [ ] Instructor/admin can access appropriate performance data

---

## Discussions and Feedback

- [ ] Discussion creation works
- [ ] Discussion retrieval works
- [ ] Replies work
- [ ] Feedback submission works
- [ ] Validation works
- [ ] Unauthorized modification is rejected

---

## Certificates

- [ ] Completion requirements are validated
- [ ] Eligible learner can generate certificate
- [ ] Certificate contains correct learner information
- [ ] Certificate contains correct course information
- [ ] Certificate can be downloaded

---

## Frontend

- [ ] All required pages are implemented
- [ ] API integration uses the agreed backend contract
- [ ] Loading states exist
- [ ] Empty states exist
- [ ] Error states exist
- [ ] Forms validate correctly
- [ ] Protected routes work
- [ ] Responsive layout works
- [ ] Frontend tests pass
- [ ] Production build succeeds

---

## Backend

- [ ] Required entities are implemented
- [ ] Repositories are implemented
- [ ] Services are implemented
- [ ] Controllers are implemented
- [ ] DTOs are implemented
- [ ] Validation exists
- [ ] Authentication works
- [ ] Authorization works
- [ ] API errors are handled
- [ ] Database migrations work
- [ ] Backend tests pass
- [ ] Swagger/OpenAPI is updated

---

## Integration

- [ ] Frontend connects to real backend
- [ ] No required feature depends on temporary mock data
- [ ] Authentication flow works end-to-end
- [ ] Course enrollment works end-to-end
- [ ] Progress tracking works end-to-end
- [ ] Quiz flow works end-to-end
- [ ] Certificate flow works end-to-end
- [ ] Error states work end-to-end
- [ ] No cross-workstream contract mismatch remains

---

# 33. Release Checklist

Before a release is considered ready:

```text
[ ] Backend branch passes tests
[ ] Frontend branch passes tests
[ ] Database migrations verified
[ ] API documentation updated
[ ] Frontend integration verified
[ ] End-to-end flows verified
[ ] README updated
[ ] CONTRACT.md updated if required
[ ] No secrets committed
[ ] No unresolved critical issues
[ ] Pull requests reviewed
```

---

# 34. Continuity Protocol

If one contributor becomes unavailable, the backup contributor may continue the work only after:

1. reading this contract
2. inspecting the current branch
3. inspecting unfinished changes
4. reviewing existing tests
5. preserving existing naming and API contracts

### Backup Assignment

| Workstream | Primary | Backup |
|---|---|---|
| Frontend | Jay | Ali |
| Backend | Ali | Jay |

The backup contributor should avoid unrelated refactoring while taking over an unfinished task.

---

# 35. Documentation Contract

The following documentation must remain updated:

```text
README.md
CONTRACT.md
API Documentation
Database Documentation
Setup Instructions
Environment Variables
Known Issues
Development Instructions
```

Any implemented feature that changes project behavior must update relevant documentation.

---

# 36. Project Structure Contract

The expected repository structure is:

```text
Learning-Management-System/
│
├── frontend/
│
├── backend/
│
├── database/
│
├── docs/
│
├── README.md
├── CONTRACT.md
├── .env.example
├── .gitignore
└── LICENSE
```

The exact package structure inside `frontend/` and `backend/` may evolve, but ownership boundaries remain unchanged.

---

# 37. Quality Rules

The project must prioritize:

```text
Correctness
Security
Maintainability
Consistency
Testability
Usability
```

Code should favor clear architecture over unnecessarily clever implementations.

Avoid:

- duplicated business logic
- hardcoded credentials
- hardcoded production URLs
- massive controller methods
- database access directly inside controllers
- API calls scattered across UI components
- duplicated validation
- unexplained magic values
- dead code
- unused dependencies

---

# 38. Release Boundary

Version 1.0 answers one primary question:

> Can a learner, instructor, and administrator use one secure platform to complete the core learning lifecycle from authentication through course completion?

The intended experience is:

```text
User
 ↓
Register / Login
 ↓
Role Identified
 ↓
Dashboard
 ↓
Course Discovery
 ↓
Enrollment
 ↓
Learning
 ↓
Progress Tracking
 ↓
Assessment
 ↓
Result
 ↓
Course Completion
 ↓
Certificate
```

For instructors:

```text
Instructor
   ↓
Dashboard
   ↓
Create Course
   ↓
Add Lessons
   ↓
Create Assessment
   ↓
Publish
   ↓
Monitor Learners
```

For administrators:

```text
Administrator
      ↓
Admin Dashboard
      ↓
Users
Courses
Assessments
Categories
Performance
      ↓
Platform Management
```

---

# 39. Contract Rules Summary

The following rules are non-negotiable:

```text
1. Never work directly on main.
2. Jay owns frontend.
3. Ali owns backend and database.
4. Frontend does not modify backend files.
5. Backend does not modify frontend files.
6. API contracts must be agreed before integration.
7. Database changes are backend-owned.
8. Shared contract changes require both contributors' review.
9. Backend owns authentication and authorization.
10. Frontend guards are not security controls.
11. Tests are part of feature completion.
12. No secrets in Git.
13. No force-push.
14. No silent breaking API changes.
15. No unrelated refactoring inside feature PRs.
16. AI agents must obey this contract.
17. A feature is incomplete until frontend and backend integration works.
```

---

# 40. Revision Log

## v1.0

Initial two-workstream engineering contract.

### Major decisions

- Frontend assigned to Jay.
- Backend assigned to Ali.
- Database ownership assigned to Backend.
- API contract ownership assigned to Backend.
- Frontend integration consumes the approved API contract.
- Authentication and authorization remain backend responsibilities.
- Shared files require cross-workstream review.
- Main branch is protected from direct development.
- Feature completion requires integration testing.
- AI-assisted development rules added.
- Definition of Done established for frontend, backend, and integration.

---

# Final Ownership Map

```text
                    LEARNING MANAGEMENT SYSTEM
                              │
                 ┌────────────┴────────────┐
                 │                         │
                 ▼                         ▼
             JAY                         ALI
          FRONTEND                      BACKEND
                 │                         │
     ┌───────────┼───────────┐   ┌─────────┼──────────────┐
     │           │           │   │         │              │
     ▼           ▼           ▼   ▼         ▼              ▼
    UI        Routing      State API     Logic         Database
     │           │           │   │         │              │
     └───────────┴───────────┘   └─────────┴──────────────┘
                 │                         │
                 └──────────┬──────────────┘
                            ▼
                       INTEGRATION
                            │
                            ▼
                     COMPLETE LMS
```

**Jay:** Frontend  
**Ali:** Backend + Database  
**Shared:** API contract, integration, documentation, code review, release quality