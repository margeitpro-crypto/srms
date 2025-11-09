import React from 'react';
import { twMerge } from 'tailwind-merge';

const Card = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  variant = 'default',
  padding = 'md',
  shadow = 'md',
  rounded = 'lg',
  border = true,
  hover = false,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  ...props
}) => {
  const baseClasses = 'bg-white overflow-hidden transition-all duration-200';

  const variants = {
    default: 'border-gray-200',
    primary: 'border-blue-200 bg-blue-50',
    success: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    danger: 'border-red-200 bg-red-50',
    dark: 'bg-gray-800 border-gray-700 text-white'
  };

  const paddings = {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
    xl: 'p-8 sm:p-10'
  };

  const shadows = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const roundedOptions = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  };

  const cardClasses = twMerge(
    baseClasses,
    border && 'border',
    variants[variant],
    shadows[shadow],
    roundedOptions[rounded],
    hover && 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer',
    className
  );

  const headerClasses = twMerge(
    'border-b border-gray-200 bg-gray-50 px-6 py-4',
    variant === 'dark' && 'border-gray-600 bg-gray-700',
    headerClassName
  );

  const bodyClasses = twMerge(
    paddings[padding],
    bodyClassName
  );

  const footerClasses = twMerge(
    'border-t border-gray-200 bg-gray-50 px-6 py-4',
    variant === 'dark' && 'border-gray-600 bg-gray-700',
    footerClassName
  );

  const hasHeader = title || subtitle || headerAction;
  const hasFooter = footer;

  return (
    <div className={cardClasses} {...props}>
      {hasHeader && (
        <div className={headerClasses}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {title && (
                <h3 className={twMerge(
                  'text-lg font-medium leading-6',
                  variant === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className={twMerge(
                  'mt-1 text-sm',
                  variant === 'dark' ? 'text-gray-300' : 'text-gray-500'
                )}>
                  {subtitle}
                </p>
              )}
            </div>
            {headerAction && (
              <div className="flex-shrink-0">
                {headerAction}
              </div>
            )}
          </div>
        </div>
      )}

      <div className={bodyClasses}>
        {children}
      </div>

      {hasFooter && (
        <div className={footerClasses}>
          {footer}
        </div>
      )}
    </div>
  );
};

// Card sub-components
Card.Header = ({ children, className = '', ...props }) => (
  <div className={twMerge('px-6 py-4 border-b border-gray-200', className)} {...props}>
    {children}
  </div>
);

Card.Body = ({ children, className = '', padding = 'md', ...props }) => {
  const paddings = {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
    xl: 'p-8 sm:p-10'
  };

  return (
    <div className={twMerge(paddings[padding], className)} {...props}>
      {children}
    </div>
  );
};

Card.Footer = ({ children, className = '', ...props }) => (
  <div className={twMerge('px-6 py-4 border-t border-gray-200 bg-gray-50', className)} {...props}>
    {children}
  </div>
);

Card.Title = ({ children, className = '', ...props }) => (
  <h3 className={twMerge('text-lg font-medium leading-6 text-gray-900', className)} {...props}>
    {children}
  </h3>
);

Card.Subtitle = ({ children, className = '', ...props }) => (
  <p className={twMerge('mt-1 text-sm text-gray-500', className)} {...props}>
    {children}
  </p>
);

export default Card;
