import React, { useState, useEffect, useCallback } from 'react';
import { Input, Select, Radio, Typography } from 'antd';
import { SearchOutlined, AppstoreOutlined } from '@ant-design/icons';
import CourseList from '../components/CourseList';
import ErrorState from '../components/common/ErrorState';
import { courseApi, categoryApi, enrollmentApi } from '../api';
import { useAuth } from '../hooks/useAuth';

const { Title, Paragraph } = Typography;
const { Option } = Select;

export const CourseCatalogPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCatalogData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedCategory) params.categoryId = selectedCategory;

      const [coursesData, categoriesData] = await Promise.all([
        courseApi.getAllCourses(params),
        categoryApi.getAllCategories(),
      ]);

      setCourses(coursesData || []);
      setCategories(categoriesData || []);

      if (isAuthenticated && user?.id) {
        try {
          const userEnrollments = await enrollmentApi.getUserEnrollments(user.id);
          const ids = new Set((userEnrollments || []).map((e) => e.courseId));
          setEnrolledIds(ids);
        } catch (e) {
          // Non-blocking
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load course catalogue');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, isAuthenticated, user]);

  useEffect(() => {
    fetchCatalogData();
  }, [fetchCatalogData]);

  return (
    <div className="space-y-8">
      {/* Catalog Title Banner */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Explore Course Catalogue
        </h1>
        <p className="text-gray-500 text-sm max-w-2xl">
          Discover high-quality courses across disciplines. Enroll to begin learning, complete lessons, and earn certificates.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <Input
            prefix={<SearchOutlined className="text-gray-400 mr-1" />}
            placeholder="Search by course title or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            size="large"
            className="rounded-xl"
          />
        </div>

        <div className="w-full md:w-64">
          <Select
            placeholder="All Categories"
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val)}
            allowClear
            size="large"
            className="w-full rounded-xl"
          >
            {categories.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.name}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-gray-500 font-semibold uppercase tracking-wider px-1">
        <span>Showing {courses.length} {courses.length === 1 ? 'course' : 'courses'}</span>
        {selectedCategory && (
          <span>
            Filtered by category
          </span>
        )}
      </div>

      {/* Content */}
      {error ? (
        <ErrorState
          title="Failed to load courses"
          subTitle={error}
          onRetry={fetchCatalogData}
        />
      ) : (
        <CourseList
          courses={courses}
          loading={loading}
          enrolledCourseIds={enrolledIds}
          emptyMessage="No courses found matching your search. Try another query or category."
          onEnrollmentChanged={fetchCatalogData}
        />
      )}
    </div>
  );
};

export default CourseCatalogPage;
