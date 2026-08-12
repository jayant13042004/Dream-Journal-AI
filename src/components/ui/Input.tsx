'use client';

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  isTextArea?: boolean;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      isTextArea = false,
      leftIcon,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const hasError = !!error;

    const baseInputStyles = `w-full rounded-lg border bg-transparent px-3 py-2 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${leftIcon && !isTextArea ? 'pl-10' : ''}`;
    
    const borderStyles = hasError 
      ? 'border-red-500 focus-visible:ring-red-500/50' 
      : 'border-[var(--border-default)] focus-visible:ring-[var(--accent)] focus-visible:border-[var(--accent)]';

    const inputClasses = `${baseInputStyles} ${borderStyles} ${className}`;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[var(--text-primary)]">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && !isTextArea && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--text-secondary)]">
              {leftIcon}
            </div>
          )}
          {isTextArea ? (
            <textarea
              ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
              id={inputId}
              className={`${inputClasses} min-h-[80px] resize-y`}
              aria-invalid={hasError}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.ForwardedRef<HTMLInputElement>}
              id={inputId}
              className={inputClasses}
              aria-invalid={hasError}
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}
        </div>
        {(error || hint) && (
          <p className={`text-sm ${hasError ? 'text-red-500' : 'text-[var(--text-secondary)]'}`}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
