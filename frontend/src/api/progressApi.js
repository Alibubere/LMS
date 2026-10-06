import apiClient from './client';

export const progressApi = {
  getCourseProgress: async (courseId) => {
    const response = await apiClient.get(`/api/v1/courses/${courseId}/progress`);
    return response.data;
  },

  recordLessonProgress: async (lessonId, data) => {
    // data: { completed, watchTimeSeconds, completionPercentage }
    const response = await apiClient.post(`/api/v1/lessons/${lessonId}/progress`, data);
    return response.data;
  },

  patchLessonProgress: async (lessonId, data) => {
    const response = await apiClient.patch(`/api/v1/lessons/${lessonId}/progress`, data);
    return response.data;
  },
};

export default progressApi;
