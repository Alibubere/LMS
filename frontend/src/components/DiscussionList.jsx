import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Form, message } from 'antd';
import { PlusOutlined, MessageOutlined } from '@ant-design/icons';
import DiscussionItem from './DiscussionItem';
import LoadingState from './common/LoadingState';
import EmptyState from './common/EmptyState';
import ErrorState from './common/ErrorState';
import { discussionApi } from '../api';
import { useAuth } from '../hooks/useAuth';

const { TextArea } = Input;

export const DiscussionList = ({ courseId }) => {
  const { isAuthenticated } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const fetchDiscussions = useCallback(async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await discussionApi.getCourseDiscussions(courseId);
      setDiscussions(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load discussions');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchDiscussions();
  }, [fetchDiscussions]);

  const handleCreateDiscussion = async (values) => {
    try {
      setSubmitting(true);
      await discussionApi.createDiscussion(courseId, {
        title: values.title?.trim(),
        content: values.content?.trim(),
      });
      message.success('Discussion thread created!');
      form.resetFields();
      setShowNewThreadForm(false);
      fetchDiscussions();
    } catch (err) {
      message.error(err.message || 'Failed to post thread');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="section-head">
        <h3 className="text-display-md text-ink">
          <span className="inline-flex items-center gap-2">
            <MessageOutlined />
            <span>Course Discussions ({discussions.length})</span>
          </span>
        </h3>

        {isAuthenticated && !showNewThreadForm && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="small"
            onClick={() => setShowNewThreadForm(true)}
          >
            New Thread
          </Button>
        )}
      </div>

      {showNewThreadForm && (
        <div className="card mb-4">
          <div className="card-pad">
            <p className="eyebrow mb-3">Start a discussion</p>
          <Form form={form} layout="vertical" onFinish={handleCreateDiscussion}>
            <Form.Item
              name="title"
              label="Topic Title"
              rules={[{ required: true, message: 'Please enter a discussion title' }]}
            >
              <Input placeholder="What would you like to discuss?" />
            </Form.Item>

            <Form.Item
              name="content"
              label="Description / Question"
              rules={[{ required: true, message: 'Please provide details for your discussion' }]}
            >
              <TextArea rows={3} placeholder="Share context, questions, or resources..." />
            </Form.Item>

            <div className="flex justify-end space-x-2">
              <Button onClick={() => setShowNewThreadForm(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={submitting} >
                Post Discussion
              </Button>
            </div>
          </Form>
          </div>
        </div>
      )}

      {loading && <LoadingState tip="Loading forum discussions..." />}

      {!loading && error && (
        <ErrorState
          title="Could not load discussions"
          subTitle={error}
          onRetry={fetchDiscussions}
        />
      )}

      {!loading && !error && discussions.length === 0 && (
        <EmptyState
          description="No discussions yet. Be the first to start a conversation!"
          actionText={isAuthenticated ? 'Start Discussion' : null}
          onAction={() => setShowNewThreadForm(true)}
        />
      )}

      {!loading && !error && discussions.length > 0 && (
        <div className="space-y-3">
          {discussions.map((d) => (
            <DiscussionItem
              key={d.id}
              discussion={d}
              onReplyAdded={fetchDiscussions}
              onDeleted={fetchDiscussions}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscussionList;
