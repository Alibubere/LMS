import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Tag } from 'antd';
import {
  SearchOutlined,
  BookOutlined,
  TrophyOutlined,
  CheckCircleFilled,
  RocketOutlined,
  SafetyCertificateOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import CourseList from '../components/CourseList';
import { courseApi, categoryApi } from '../api';
import { useAuth } from '../hooks/useAuth';

export const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        setLoading(true);
        const [courseList, catList] = await Promise.all([
          courseApi.getAllCourses(),
          categoryApi.getAllCategories(),
        ]);
        setCourses(courseList || []);
        setCategories(catList || []);
      } catch (err) {
        console.error('Failed to load featured data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 text-white p-8 sm:p-16 shadow-xl">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-blue-200">
            <RocketOutlined />
            <span>Modern Learning Management Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Empower Your Future with Structured Learning & Verified Credentials.
          </h1>

          <p className="text-blue-100 text-base sm:text-lg leading-relaxed max-w-2xl">
            Explore industry-aligned courses, progress through structured lessons, test your skills with rigorous assessments, and earn verifiable certificates.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link to="/courses">
              <Button
                type="primary"
                size="large"
                className="bg-blue-500 hover:bg-blue-400 font-bold h-12 px-8 rounded-xl shadow-md border-0"
              >
                Browse All Courses
              </Button>
            </Link>

            {!isAuthenticated ? (
              <Link to="/register">
                <Button
                  size="large"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold h-12 px-6 rounded-xl border border-white/20 backdrop-blur-md"
                >
                  Join for Free
                </Button>
              </Link>
            ) : (
              <Link to={user?.role === 'ADMIN' ? '/admin' : user?.role === 'INSTRUCTOR' ? '/instructor' : '/learner'}>
                <Button
                  size="large"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold h-12 px-6 rounded-xl border border-white/20 backdrop-blur-md"
                >
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
            <BookOutlined />
          </div>
          <h3 className="font-bold text-lg text-gray-900">Structured Curriculum</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Step-by-step modular lessons with rich multimedia, code notes, and sequential learning.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl">
            <CheckCircleFilled />
          </div>
          <h3 className="font-bold text-lg text-gray-900">Authoritative Assessments</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Server-evaluated quizzes with immediate feedback, detailed rationales, and objective grading.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl">
            <SafetyCertificateOutlined />
          </div>
          <h3 className="font-bold text-lg text-gray-900">Verified Certificates</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Official completion certificates with unique codes verifying course requirements were completed.
          </p>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Featured Courses</h2>
            <p className="text-gray-500 text-sm">Explore courses taught by experienced instructors</p>
          </div>
          <Link to="/courses" className="text-blue-600 font-semibold text-sm hover:underline">
            View All →
          </Link>
        </div>

        <CourseList courses={courses.slice(0, 8)} loading={loading} />
      </section>
    </div>
  );
};

export default HomePage;
