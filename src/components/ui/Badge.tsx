'use client';

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'mood';
  size?: 'sm' | 'md';
  color?: string; // used for mood variant
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  color,
  className = '',
}) => {
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  };

  const variants = {
    default: 'bg-[var(--border-default)] text-[var(--text-primary)]',
    success: 'bg-green-500/10 text-green-500',
    warning: 'bg-yellow-500/10 text-yellow-500',
    danger: 'bg-red-500/10 text-red-500',
    info: 'bg-blue-500/10 text-blue-500',
    mood: '', // styled via inline style if color is provided
  };

  const style = variant === 'mood' && color ? { backgroundColor: `${color}20`, color: color } : {};

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${sizes[size]} ${variants[variant]} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
};
