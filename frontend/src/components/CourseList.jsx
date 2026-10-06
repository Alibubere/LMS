import React from 'react';
import CourseCard from './CourseCard';
import EmptyState from './common/EmptyState';
import LoadingState from './common/LoadingState';

export const CourseList = ({
  courses = [],
  loading = false,
  enrolledCourseIds = new Set(),
  courseProgressMap = {},
  showStatus = false,
  emptyMessage = 'No courses match your criteria.',
  onEnrollmentChanged,
}) => {
  if (loading) {
    return <LoadingState tip="Loading course catalog..." />;
  }

  if (!courses || courses.length === 0) {
    return <EmptyState description={emptyMessage} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course) => {
        const isEnrolled = enrolledCourseIds.has(course.id);
        const progress = courseProgressMap[course.id] || null;

        return (
          <CourseCard
            key={course.id}
            course={course}
            isEnrolled={isEnrolled}
            progress={progress}
            showStatus={showStatus}
            onEnrollmentChanged={onEnrollmentChanged}
          />
        );
      })}
    </div>
  );
};

export default CourseList;
