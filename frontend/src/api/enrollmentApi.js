import apiClient from './client';

export const enrollmentApi = {
  enroll: async (courseId, userId = null) => {
    const body = userId ? { userId } : {};
    const response = await apiClient.post(`/api/v1/courses/${courseId}/enroll`, body);
    return response.data;
  },

  unenroll: async (courseId, userId = null) => {
    const params = userId ? { userId } : {};
    const response = await apiClient.delete(`/api/v1/courses/${courseId}/enroll`, { params });
    return response.data;
  },

  getUserEnrollments: async (userId) => {
    const response = await apiClient.get(`/api/v1/users/${userId}/enrollments`);
    return response.data;
  },
};

export default enrollmentApi;
