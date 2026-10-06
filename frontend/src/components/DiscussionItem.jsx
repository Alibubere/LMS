import React, { useState } from 'react';
import { Avatar, Button, Input, Popconfirm, message } from 'antd';
import { UserOutlined, MessageOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { discussionApi } from '../api';
import { formatDate } from '../utils/formatters';
import { ROLES } from '../utils/constants';
import { Badge } from './ui';

const { TextArea } = Input;

export const DiscussionItem = ({
  discussion,
  onReplyAdded,
  onDeleted,
  depth = 0,
}) => {
  const { user, role, isAuthenticated } = useAuth();
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const canDelete =
    isAuthenticated &&
    (user?.id === discussion.userId || role === ROLES.ADMIN);

  const handleSendReply = async () => {
    if (!replyContent.trim()) {
      message.error('Reply content cannot be empty');
      return;
    }

    try {
      setSubmittingReply(true);
      await discussionApi.replyToDiscussion(discussion.id, {
        content: replyContent.trim(),
      });
      message.success('Reply submitted!');
      setReplyContent('');
      setShowReplyBox(false);
      if (onReplyAdded) onReplyAdded();
    } catch (err) {
      message.error(err.message || 'Failed to submit reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await discussionApi.deleteDiscussion(discussion.id);
      message.success('Discussion deleted');
      if (onDeleted) onDeleted(discussion.id);
    } catch (err) {
      message.error(err.message || 'Failed to delete discussion');
    } finally {
      setDeleting(false);
    }
  };

  const roleVariant =
    discussion.userRole === ROLES.ADMIN
      ? 'danger'
      : discussion.userRole === ROLES.INSTRUCTOR
      ? 'warning'
      : 'outline';

  return (
    <div
      className={`border border-hairline bg-canvas ${
        depth > 0 ? 'ml-4 mt-3 border-l-2 border-l-primary p-4 sm:ml-8' : 'mb-4 p-5'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Avatar
            size="small"
            src={discussion.userAvatarUrl}
            icon={!discussion.userAvatarUrl && <UserOutlined />}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-caption-strong text-ink">
                {discussion.userName || 'Anonymous'}
              </span>
              {discussion.userRole && (
                <Badge variant={roleVariant} className="px-1.5 py-0">
                  {discussion.userRole}
                </Badge>
              )}
            </div>
            <span className="text-mono-caption text-body">{formatDate(discussion.createdAt)}</span>
          </div>
        </div>

        {canDelete && (
          <Popconfirm
            title="Delete this message?"
            onConfirm={handleDelete}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, loading: deleting }}
          >
            <Button type="text" danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        )}
      </div>

      {discussion.title && (
        <h4 className="mt-3 mb-1 text-body-md-strong text-ink">{discussion.title}</h4>
      )}

      <p className="mt-1 whitespace-pre-line text-body-md leading-relaxed text-ink">
        {discussion.content}
      </p>

      {isAuthenticated && depth < 2 && (
        <div className="mt-3 flex items-center gap-2">
          <Button
            type="link"
            size="small"
            icon={<MessageOutlined />}
            onClick={() => setShowReplyBox(!showReplyBox)}
            className="px-0 text-caption text-ink underline underline-offset-4"
          >
            {showReplyBox ? 'Cancel' : 'Reply'}
          </Button>
        </div>
      )}

      {showReplyBox && (
        <div className="mt-3 border-l-2 border-l-primary pl-4">
          <TextArea
            rows={2}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your constructive reply..."
            className="text-body-md"
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button size="small" onClick={() => setShowReplyBox(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              size="small"
              icon={<SendOutlined />}
              loading={submittingReply}
              onClick={handleSendReply}
            >
              Post Reply
            </Button>
          </div>
        </div>
      )}

      {/* Threaded replies */}
      {discussion.replies && discussion.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {discussion.replies.map((reply) => (
            <DiscussionItem
              key={reply.id}
              discussion={reply}
              onReplyAdded={onReplyAdded}
              onDeleted={onDeleted}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscussionItem;
