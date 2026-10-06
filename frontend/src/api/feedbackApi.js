import apiClient from './client';

export const feedbackApi = {
  getCourseFeedback: async (courseId) => {
    const response = await apiClient.get(`/api/v1/courses/${courseId}/feedback`);
    return response.data;
  },

  submitFeedback: async (courseId, data) => {
    // data: { rating, comment }
    const response = await apiClient.post(`/api/v1/courses/${courseId}/feedback`, data);
    return response.data;
  },

  updateFeedback: async (feedbackId, data) => {
    const response = await apiClient.put(`/api/v1/feedback/${feedbackId}`, data);
    return response.data;
  },
};

export default feedbackApi;
