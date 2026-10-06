import React from 'react';
import { useParams } from 'react-router-dom';
import CourseDetails from '../components/CourseDetails';

export const CourseDetailPage = () => {
  const { id } = useParams();

  return <CourseDetails courseId={id} />;
};

export default CourseDetailPage;
