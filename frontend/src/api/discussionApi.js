import apiClient from './client';

export const discussionApi = {
  getCourseDiscussions: async (courseId) => {
    const response = await apiClient.get(`/api/v1/courses/${courseId}/discussions`);
    return response.data;
  },

  createDiscussion: async (courseId, data) => {
    // data: { title, content }
    const response = await apiClient.post(`/api/v1/courses/${courseId}/discussions`, data);
    return response.data;
  },

  replyToDiscussion: async (discussionId, data) => {
    // data: { content }
    const response = await apiClient.post(`/api/v1/discussions/${discussionId}/replies`, data);
    return response.data;
  },

  deleteDiscussion: async (discussionId) => {
    const response = await apiClient.delete(`/api/v1/discussions/${discussionId}`);
    return response.data;
  },
};

export default discussionApi;
