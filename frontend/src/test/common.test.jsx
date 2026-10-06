import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';

describe('Common UI States Contract', () => {
  it('renders LoadingState with custom tip text', () => {
    render(<LoadingState tip="Fetching catalog..." />);
    expect(screen.getByText('Fetching catalog...')).toBeInTheDocument();
  });

  it('renders ErrorState with title, message, and triggers onRetry callback', () => {
    const handleRetry = vi.fn();
    render(
      <ErrorState
        title="Failed to load resource"
        subTitle="Server timeout occurred"
        onRetry={handleRetry}
      />
    );

    expect(screen.getByText('Failed to load resource')).toBeInTheDocument();
    expect(screen.getByText('Server timeout occurred')).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
    fireEvent.click(retryButton);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('renders EmptyState with custom description and action button', () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        description="No courses available yet"
        actionText="Create Course"
        onAction={handleAction}
      />
    );

    expect(screen.getByText('No courses available yet')).toBeInTheDocument();
    const actionButton = screen.getByRole('button', { name: /create course/i });
    expect(actionButton).toBeInTheDocument();
    fireEvent.click(actionButton);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});
