import React from 'react';
import { useParams } from 'react-router-dom';
import CourseDetails from '../components/CourseDetails';

export const CourseDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="py-2">
      <CourseDetails courseId={id} />
    </div>
  );
};

export default CourseDetailPage;
