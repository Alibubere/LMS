export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const ROLES = {
  LEARNER: 'LEARNER',
  INSTRUCTOR: 'INSTRUCTOR',
  ADMIN: 'ADMIN',
};

export const COURSE_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
};

export const ENROLLMENT_STATUS = {
  ENROLLED: 'ENROLLED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  DROPPED: 'DROPPED',
};

export const STORAGE_KEYS = {
  TOKEN: 'lms_auth_token',
  USER: 'lms_auth_user',
};
