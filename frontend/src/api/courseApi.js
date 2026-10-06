import apiClient from './client';

export const courseApi = {
  getAllCourses: async (params = {}) => {
    // params: { search, categoryId, status, instructorId }
    const response = await apiClient.get('/api/v1/courses', { params });
    return response.data;
  },

  getCourseById: async (id) => {
    const response = await apiClient.get(`/api/v1/courses/${id}`);
    return response.data;
  },

  createCourse: async (data) => {
    // data: { title, description, categoryId, status, thumbnailUrl }
    const response = await apiClient.post('/api/v1/courses', data);
    return response.data;
  },

  updateCourse: async (id, data) => {
    const response = await apiClient.put(`/api/v1/courses/${id}`, data);
    return response.data;
  },

  deleteCourse: async (id) => {
    const response = await apiClient.delete(`/api/v1/courses/${id}`);
    return response.data;
  },
};

export default courseApi;
