'use client';

import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'card' | 'rect';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
}) => {
  const variants = {
    text: 'h-4 w-full rounded',
    circle: 'rounded-full',
    card: 'rounded-xl h-32 w-full',
    rect: 'rounded-md w-full',
  };

  return (
    <div
      className={`skeleton animate-pulse bg-[var(--border-default)] ${variants[variant]} ${className}`}
      aria-hidden="true"
    />
  );
};
