import React, { useState, useEffect, useCallback } from 'react';
import { Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import CourseList from '../components/CourseList';
import ErrorState from '../components/common/ErrorState';
import { courseApi, categoryApi, enrollmentApi } from '../api';
import { useAuth } from '../hooks/useAuth';

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
      {/* Page header */}
      <header className="space-y-4 border-b border-hairline pb-8">
        <p className="eyebrow">Catalogue</p>
        <h1 className="text-display-xl text-ink">Explore Course Catalogue</h1>
        <p className="lead max-w-2xl">
          Discover high-quality courses across disciplines. Enroll to begin learning, complete
          lessons, and earn certificates.
        </p>
      </header>

      {/* Filter and search bar */}
      <div className="card">
        <div className="card-pad flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1 w-full">
            <Input
              prefix={<SearchOutlined className="mr-1 text-body" />}
              placeholder="Search by course title or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              size="large"
              aria-label="Search courses"
            />
          </div>

          <div className="w-full md:w-64">
            <Select
              placeholder="All Categories"
              value={selectedCategory}
              onChange={(val) => setSelectedCategory(val)}
              allowClear
              size="large"
              className="w-full"
              aria-label="Filter by category"
            >
              {categories.map((c) => (
                <Option key={c.id} value={c.id}>
                  {c.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline px-6 py-4">
          <span className="eyebrow">
            Showing {courses.length} {courses.length === 1 ? 'course' : 'courses'}
          </span>
          {selectedCategory && <span className="eyebrow">Filtered by category</span>}
        </div>
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
