import React, { useState } from 'react';
import { Button, Tag, Card, message } from 'antd';
import {
  CheckCircleOutlined,
  LeftOutlined,
  RightOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { progressApi } from '../api';
import { formatDuration } from '../utils/formatters';

export const LessonPlayer = ({
  lesson,
  courseId,
  onProgressUpdated,
  onNextLesson,
  onPrevLesson,
  hasNext = false,
  hasPrev = false,
}) => {
  const [marking, setMarking] = useState(false);

  if (!lesson) {
    return (
      <Card className="rounded-xl p-8 text-center text-gray-500 border-dashed">
        Please select a lesson from the curriculum to begin learning.
      </Card>
    );
  }

  const {
    id: lessonId,
    title,
    description,
    contentUrl,
    contentText,
    durationMinutes,
    completed = false,
  } = lesson;

  const handleMarkComplete = async () => {
    try {
      setMarking(true);
      await progressApi.recordLessonProgress(lessonId, {
        completed: true,
        completionPercentage: 100.0,
        watchTimeSeconds: (durationMinutes || 10) * 60,
      });
      message.success('Lesson marked as complete!');
      if (onProgressUpdated) onProgressUpdated(lessonId, true);
    } catch (err) {
      message.error(err.message || 'Failed to update lesson progress');
    } finally {
      setMarking(false);
    }
  };

  const isVideo = Boolean(
    contentUrl && (contentUrl.includes('youtube') || contentUrl.includes('youtu.be') || contentUrl.includes('vimeo') || contentUrl.endsWith('.mp4'))
  );

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  return (
    <div className="space-y-6">
      {/* Content Viewer / Video Player */}
      <div className="bg-black rounded-2xl overflow-hidden shadow-md aspect-video max-h-[520px] flex items-center justify-center">
        {isVideo ? (
          contentUrl.endsWith('.mp4') ? (
            <video controls className="w-full h-full object-contain" src={contentUrl} />
          ) : (
            <iframe
              src={getEmbedUrl(contentUrl)}
              title={title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )
        ) : contentUrl ? (
          <div className="p-8 text-center text-white space-y-4">
            <VideoCameraOutlined className="text-4xl text-blue-400" />
            <p className="text-sm text-gray-300">External Resource Available</p>
            <a
              href={contentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
            >
              Open External Content
            </a>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <FileTextOutlined className="text-4xl text-slate-500" />
            <p className="text-sm">Reading lesson material below</p>
          </div>
        )}
      </div>

      {/* Lesson Controls & Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
              {completed && (
                <Tag color="success" icon={<CheckCircleOutlined />}>
                  Completed
                </Tag>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Estimated duration: {formatDuration(durationMinutes)}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              type={completed ? 'default' : 'primary'}
              icon={<CheckCircleOutlined />}
              loading={marking}
              onClick={handleMarkComplete}
              className={!completed ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
            >
              {completed ? 'Marked as Complete' : 'Mark Lesson Complete'}
            </Button>
          </div>
        </div>

        {description && (
          <p className="text-gray-600 text-sm border-t border-gray-100 pt-3">
            {description}
          </p>
        )}

        {/* Written content */}
        {contentText && (
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Lesson Notes</h4>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
              {contentText}
            </div>
          </div>
        )}

        {/* Previous / Next buttons */}
        <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
          <Button
            icon={<LeftOutlined />}
            disabled={!hasPrev}
            onClick={onPrevLesson}
          >
            Previous Lesson
          </Button>
          <Button
            type="primary"
            icon={<RightOutlined />}
            disabled={!hasNext}
            onClick={onNextLesson}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Next Lesson
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonPlayer;
