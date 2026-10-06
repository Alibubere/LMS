import React, { useState, useEffect, useCallback } from 'react';
import { Card, Rate, Input, Button, Form, message, Avatar, Progress } from 'antd';
import { UserOutlined, StarFilled } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { feedbackApi } from '../api';
import { formatDate } from '../utils/formatters';
import LoadingState from './common/LoadingState';
import EmptyState from './common/EmptyState';
import ErrorState from './common/ErrorState';

const { TextArea } = Input;

export const FeedbackForm = ({ courseId, isEnrolled = false }) => {
  const { user, isAuthenticated } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [userFeedback, setUserFeedback] = useState(null);
  const [form] = Form.useForm();

  const fetchFeedback = useCallback(async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await feedbackApi.getCourseFeedback(courseId);
      const list = data || [];
      setFeedbacks(list);

      // Check if current user already submitted feedback
      if (user) {
        const existing = list.find((f) => f.userId === user.id);
        if (existing) {
          setUserFeedback(existing);
          form.setFieldsValue({
            rating: existing.rating,
            comment: existing.comment,
          });
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load feedback');
    } finally {
      setLoading(false);
    }
  }, [courseId, user, form]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      if (userFeedback) {
        await feedbackApi.updateFeedback(userFeedback.id, {
          rating: values.rating,
          comment: values.comment?.trim(),
        });
        message.success('Your review has been updated!');
      } else {
        await feedbackApi.submitFeedback(courseId, {
          rating: values.rating,
          comment: values.comment?.trim(),
        });
        message.success('Thank you for your feedback!');
      }
      fetchFeedback();
    } catch (err) {
      message.error(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate average rating
  const avgRating =
    feedbacks.length > 0
      ? (feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length).toFixed(1)
      : null;

  return (
    <div className="space-y-6">
      {/* Rating summary */}
      <Card className="rounded-xl border-gray-200">
        <div className="flex flex-col sm:flex-row items-center sm:space-x-8 text-center sm:text-left">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-extrabold text-gray-900">{avgRating || '—'}</span>
            <Rate disabled allowHalf value={Number(avgRating) || 0} className="text-yellow-400 text-sm mt-1" />
            <span className="text-xs text-gray-400 mt-1">
              Based on {feedbacks.length} {feedbacks.length === 1 ? 'review' : 'reviews'}
            </span>
          </div>

          {/* Star breakdown */}
          <div className="flex-1 w-full mt-4 sm:mt-0 space-y-1">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = feedbacks.filter((f) => f.rating === stars).length;
              const pct = feedbacks.length > 0 ? (count / feedbacks.length) * 100 : 0;
              return (
                <div key={stars} className="flex items-center space-x-2 text-xs text-gray-500">
                  <span className="w-12 text-right">{stars} stars</span>
                  <Progress percent={Math.round(pct)} size="small" showInfo={false} strokeColor="#f59e0b" className="flex-1 m-0" />
                  <span className="w-6 text-gray-400 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Submit / Edit review for enrolled learners */}
      {isAuthenticated && isEnrolled && (
        <Card className="rounded-xl border-blue-200 bg-blue-50/20">
          <h4 className="font-semibold text-sm text-gray-800 mb-2">
            {userFeedback ? 'Edit Your Review' : 'Leave Course Feedback'}
          </h4>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="rating"
              label="Rating"
              rules={[{ required: true, message: 'Please select a star rating' }]}
              initialValue={5}
            >
              <Rate className="text-yellow-400" />
            </Form.Item>

            <Form.Item
              name="comment"
              label="Your Review"
              rules={[{ required: true, message: 'Please write a brief comment' }]}
            >
              <TextArea rows={3} placeholder="What did you think of the course content, lessons, and assignments?" />
            </Form.Item>

            <div className="flex justify-end">
              <Button type="primary" htmlType="submit" loading={submitting} className="bg-blue-600">
                {userFeedback ? 'Update Review' : 'Submit Review'}
              </Button>
            </div>
          </Form>
        </Card>
      )}

      {/* Review List */}
      <div className="space-y-3">
        <h4 className="font-bold text-sm text-gray-800">Learner Reviews</h4>

        {loading && <LoadingState tip="Loading feedback..." />}

        {!loading && error && (
          <ErrorState title="Failed to load feedback" subTitle={error} onRetry={fetchFeedback} />
        )}

        {!loading && !error && feedbacks.length === 0 && (
          <EmptyState description="No feedback yet for this course." />
        )}

        {!loading && !error && feedbacks.length > 0 && (
          <div className="space-y-3">
            {feedbacks.map((f) => (
              <div key={f.id} className="p-4 bg-white rounded-xl border border-gray-100 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Avatar
                      size="small"
                      src={f.userAvatarUrl}
                      icon={!f.userAvatarUrl && <UserOutlined />}
                      className="bg-indigo-500"
                    />
                    <div>
                      <span className="text-xs font-semibold text-gray-800 block">
                        {f.userName || 'Learner'}
                      </span>
                      <span className="text-[11px] text-gray-400">{formatDate(f.createdAt)}</span>
                    </div>
                  </div>
                  <Rate disabled value={f.rating} className="text-yellow-400 text-xs" />
                </div>
                <p className="text-gray-700 text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                  {f.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;
