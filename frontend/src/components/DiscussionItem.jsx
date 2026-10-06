import React, { useState } from 'react';
import { Avatar, Button, Input, Tag, Popconfirm, message } from 'antd';
import { UserOutlined, MessageOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { discussionApi } from '../api';
import { formatDate } from '../utils/formatters';
import { ROLES } from '../utils/constants';

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

  const roleColor =
    discussion.userRole === ROLES.ADMIN
      ? 'red'
      : discussion.userRole === ROLES.INSTRUCTOR
      ? 'orange'
      : 'blue';

  return (
    <div className={`p-4 bg-white rounded-lg border border-gray-100 ${depth > 0 ? 'ml-6 mt-3 bg-gray-50/50' : 'mb-4 shadow-2xs'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2.5">
          <Avatar
            size="small"
            src={discussion.userAvatarUrl}
            icon={!discussion.userAvatarUrl && <UserOutlined />}
            className="bg-blue-500"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-gray-900">
                {discussion.userName || 'Anonymous'}
              </span>
              {discussion.userRole && (
                <Tag color={roleColor} className="text-[10px] py-0 px-1.5 leading-tight m-0">
                  {discussion.userRole}
                </Tag>
              )}
            </div>
            <span className="text-[11px] text-gray-400">
              {formatDate(discussion.createdAt)}
            </span>
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
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              className="text-gray-400 hover:text-red-500"
            />
          </Popconfirm>
        )}
      </div>

      {discussion.title && (
        <h4 className="font-semibold text-sm text-gray-800 mt-2 mb-1">
          {discussion.title}
        </h4>
      )}

      <p className="text-gray-700 text-xs sm:text-sm mt-1 whitespace-pre-line leading-relaxed">
        {discussion.content}
      </p>

      {isAuthenticated && depth < 2 && (
        <div className="mt-2.5 flex items-center space-x-2">
          <Button
            type="link"
            size="small"
            icon={<MessageOutlined />}
            onClick={() => setShowReplyBox(!showReplyBox)}
            className="p-0 text-xs text-blue-600 hover:text-blue-800"
          >
            {showReplyBox ? 'Cancel' : 'Reply'}
          </Button>
        </div>
      )}

      {showReplyBox && (
        <div className="mt-3 pl-3 border-l-2 border-blue-400">
          <TextArea
            rows={2}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your constructive reply..."
            className="text-xs"
          />
          <div className="mt-2 flex justify-end space-x-2">
            <Button size="small" onClick={() => setShowReplyBox(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              size="small"
              icon={<SendOutlined />}
              loading={submittingReply}
              onClick={handleSendReply}
              className="bg-blue-600"
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
