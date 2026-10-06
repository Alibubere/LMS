import React, { useState, useEffect, useCallback } from 'react';
import { Rate, Input, Button, Form, message, Avatar, Progress } from 'antd';
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
      <div className="card">
        <div className="card-pad-lg flex flex-col items-center gap-6 text-center sm:flex-row sm:gap-8 sm:text-left">
          <div className="flex shrink-0 flex-col items-center">
            <span className="text-display-xl text-ink">{avgRating || '—'}</span>
            <Rate disabled allowHalf value={Number(avgRating) || 0} className="mt-1" />
            <span className="mt-1 text-caption text-body">
              Based on {feedbacks.length} {feedbacks.length === 1 ? 'review' : 'reviews'}
            </span>
          </div>

          {/* Star breakdown */}
          <div className="w-full flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = feedbacks.filter((f) => f.rating === stars).length;
              const pct = feedbacks.length > 0 ? (count / feedbacks.length) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-2 text-caption text-body">
                  <span className="w-14 shrink-0 text-right">{stars} stars</span>
                  <Progress
                    percent={Math.round(pct)}
                    size="small"
                    showInfo={false}
                    strokeColor="#000000"
                    className="m-0 flex-1"
                  />
                  <span className="w-6 text-right text-ink">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit / Edit review for enrolled learners */}
      {isAuthenticated && isEnrolled && (
        <div className="card">
          <div className="card-pad-lg">
            <p className="eyebrow">
              {userFeedback ? 'Edit your review' : 'Leave course feedback'}
            </p>
            <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
              <Form.Item
                name="rating"
                label="Rating"
                rules={[{ required: true, message: 'Please select a star rating' }]}
                initialValue={5}
              >
                <Rate />
              </Form.Item>

              <Form.Item
                name="comment"
                label="Your Review"
                rules={[{ required: true, message: 'Please write a brief comment' }]}
              >
                <TextArea
                  rows={3}
                  placeholder="What did you think of the course content, lessons, and assignments?"
                />
              </Form.Item>

              <div className="flex justify-end">
                <Button type="primary" htmlType="submit" loading={submitting}>
                  {userFeedback ? 'Update Review' : 'Submit Review'}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-3">
        <p className="eyebrow">Learner reviews</p>

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
              <div key={f.id} className="border border-hairline bg-canvas p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Avatar
                      size="small"
                      src={f.userAvatarUrl}
                      icon={!f.userAvatarUrl && <UserOutlined />}
                    />
                    <div>
                      <span className="block text-caption-strong text-ink">
                        {f.userName || 'Learner'}
                      </span>
                      <span className="text-mono-caption text-body">{formatDate(f.createdAt)}</span>
                    </div>
                  </div>
                  <Rate disabled value={f.rating} className="text-caption" />
                </div>
                <p className="whitespace-pre-line text-body-md leading-relaxed text-ink">
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
