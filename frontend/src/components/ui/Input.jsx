import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = false,
  size = 'md',
  leftIcon,
  rightIcon,
  className = '',
  containerClassName = '',
  labelClassName = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}, ref) => {
  const baseInputClasses = 'block w-full rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-3 py-2.5 text-sm sm:px-4',
    lg: 'px-4 py-3 text-base'
  };

  const inputClasses = twMerge(
    baseInputClasses,
    sizes[size],
    leftIcon && 'pl-10',
    rightIcon && 'pr-10',
    error
      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500',
    disabled && 'bg-gray-50 text-gray-500',
    className
  );

  const containerClasses = twMerge(
    fullWidth ? 'w-full' : 'w-auto',
    containerClassName
  );

  const labelClasses = twMerge(
    'block text-sm font-medium text-gray-700 mb-2',
    disabled && 'text-gray-400',
    labelClassName
  );

  return (
    <div className={containerClasses}>
      {label && (
        <label className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
            <div className={twMerge(
              'h-5 w-5',
              error ? 'text-red-400' : 'text-gray-400'
            )}>
              {leftIcon}
            </div>
          </div>
        )}

        <input
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          aria-invalid={!!error}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center" aria-hidden="true">
            <div className={twMerge(
              'h-5 w-5',
              error ? 'text-red-400' : 'text-gray-400'
            )}>
              {rightIcon}
            </div>
          </div>
        )}
      </div>

      {(error || helperText) && (
        <div className="mt-2">
          {error && (
            <p className="text-sm text-red-600 flex items-center" id={props.id ? `${props.id}-error` : undefined}>
              <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className="text-sm text-gray-500" id={props.id ? `${props.id}-helper` : undefined}>
              {helperText}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;