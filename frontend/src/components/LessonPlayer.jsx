import React, { useState } from 'react';
import { Button, message } from 'antd';
import {
  CheckCircleOutlined,
  LeftOutlined,
  RightOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { progressApi } from '../api';
import { formatDuration } from '../utils/formatters';
import { Badge } from './ui';

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
      <div className="card">
        <div className="card-pad-lg text-center">
          <p className="text-body-md text-body">
            Please select a lesson from the curriculum to begin learning.
          </p>
        </div>
      </div>
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
    contentUrl &&
      (contentUrl.includes('youtube') ||
        contentUrl.includes('youtu.be') ||
        contentUrl.includes('vimeo') ||
        contentUrl.endsWith('.mp4'))
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
      {/* Content viewer / video player */}
      <div className="band-dark flex aspect-video max-h-[520px] w-full items-center justify-center overflow-hidden rounded-sm border border-hairline-dark">
        {isVideo ? (
          contentUrl.endsWith('.mp4') ? (
            <video controls className="h-full w-full object-contain" src={contentUrl} />
          ) : (
            <iframe
              src={getEmbedUrl(contentUrl)}
              title={title}
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )
        ) : contentUrl ? (
          <div className="space-y-4 p-8 text-center">
            <VideoCameraOutlined className="text-3xl text-accent-periwinkle" />
            <p className="text-body-md text-body">External Resource Available</p>
            <Button
              href={contentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-white"
            >
              Open External Content
            </Button>
          </div>
        ) : (
          <div className="space-y-3 p-8 text-center">
            <FileTextOutlined className="text-3xl text-body" />
            <p className="text-body-md text-body">Reading lesson material below</p>
          </div>
        )}
      </div>

      {/* Lesson header + content + navigation */}
      <div className="card">
        <div className="card-pad">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="eyebrow">Lesson</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <h2 className="text-display-md text-ink">{title}</h2>
                {completed && (
                  <Badge variant="success" icon={<CheckCircleOutlined />}>
                    Completed
                  </Badge>
                )}
              </div>
              <p className="mt-2 text-caption text-body">
                Estimated duration: {formatDuration(durationMinutes)}
              </p>
            </div>

            <div className="shrink-0">
              <Button
                type={completed ? 'default' : 'primary'}
                icon={<CheckCircleOutlined />}
                loading={marking}
                onClick={handleMarkComplete}
              >
                {completed ? 'Marked as Complete' : 'Mark Lesson Complete'}
              </Button>
            </div>
          </div>

          {description && (
            <p className="mt-5 border-t border-hairline pt-5 text-body-md text-body">
              {description}
            </p>
          )}

          {contentText && (
            <div className="mt-5 border-t border-hairline pt-5">
              <p className="eyebrow">Lesson notes</p>
              <div className="mt-3 whitespace-pre-line text-body-md leading-relaxed text-ink">
                {contentText}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-hairline px-6 py-5">
          <Button icon={<LeftOutlined />} disabled={!hasPrev} onClick={onPrevLesson}>
            Previous Lesson
          </Button>
          <Button
            type="primary"
            icon={<RightOutlined />}
            disabled={!hasNext}
            onClick={onNextLesson}
          >
            Next Lesson
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonPlayer;
