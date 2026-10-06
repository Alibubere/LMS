import apiClient from './client';

export const quizApi = {
  getQuizzesByCourse: async (courseId) => {
    const response = await apiClient.get(`/api/v1/courses/${courseId}/quizzes`);
    return response.data;
  },

  getQuizById: async (quizId) => {
    const response = await apiClient.get(`/api/v1/quizzes/${quizId}`);
    return response.data;
  },

  submitQuiz: async (quizId, answers) => {
    // answers format: [{ questionId: 1, selectedOption: 'A' }, ...]
    const response = await apiClient.post(`/api/v1/quizzes/${quizId}/attempts`, { answers });
    return response.data;
  },

  getQuizResults: async (quizId) => {
    const response = await apiClient.get(`/api/v1/quizzes/${quizId}/results`);
    return response.data;
  },

  createQuiz: async (courseId, data) => {
    // data: { title, description, passingScore, timeLimitMinutes, questions: [...] }
    const response = await apiClient.post(`/api/v1/courses/${courseId}/quizzes`, data);
    return response.data;
  },

  updateQuiz: async (quizId, data) => {
    const response = await apiClient.put(`/api/v1/quizzes/${quizId}`, data);
    return response.data;
  },

  deleteQuiz: async (quizId) => {
    const response = await apiClient.delete(`/api/v1/quizzes/${quizId}`);
    return response.data;
  },
};

export default quizApi;
