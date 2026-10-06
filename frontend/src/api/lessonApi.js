import apiClient from './client';

export const lessonApi = {
  getLessonsByCourse: async (courseId) => {
    const response = await apiClient.get(`/api/v1/courses/${courseId}/lessons`);
    return response.data;
  },

  getLessonById: async (lessonId) => {
    const response = await apiClient.get(`/api/v1/lessons/${lessonId}`);
    return response.data;
  },

  createLesson: async (courseId, data) => {
    // data: { title, description, contentUrl, contentText, orderIndex, durationMinutes }
    const response = await apiClient.post(`/api/v1/courses/${courseId}/lessons`, data);
    return response.data;
  },

  updateLesson: async (lessonId, data) => {
    const response = await apiClient.put(`/api/v1/lessons/${lessonId}`, data);
    return response.data;
  },

  deleteLesson: async (lessonId) => {
    const response = await apiClient.delete(`/api/v1/lessons/${lessonId}`);
    return response.data;
  },
};

export default lessonApi;
