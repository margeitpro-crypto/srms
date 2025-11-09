import React, { useState, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

const Modal = ({
  isOpen = false,
  onClose,
  children,
  title,
  subtitle,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscapeKey = true,
  showCloseButton = true,
  persistent = false,
  className = '',
  overlayClassName = '',
  contentClassName = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  footer,
  loading = false,
  ...props
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  const sizes = {
    xs: 'max-w-xs sm:max-w-md',
    sm: 'max-w-sm sm:max-w-lg',
    md: 'max-w-md sm:max-w-xl',
    lg: 'max-w-lg sm:max-w-3xl',
    xl: 'max-w-xl sm:max-w-5xl',
    full: 'max-w-full mx-2 sm:mx-4'
  };

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      setShowModal(true);
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';

      // Focus trap
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements?.length) {
        focusableElements[0].focus();
      }
    } else {
      setIsAnimating(false);
      setTimeout(() => {
        setShowModal(false);
        document.body.style.overflow = 'unset';
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      }, 200);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!closeOnEscapeKey) return;

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen && !persistent) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, closeOnEscapeKey, persistent]);

  const handleClose = () => {
    if (loading || persistent) return;
    onClose?.();
  };

  const handleOverlayClick = (event) => {
    if (
      closeOnOverlayClick &&
      event.target === event.currentTarget &&
      !persistent &&
      !loading
    ) {
      handleClose();
    }
  };

  const handleKeyDown = (event) => {
    if (!isOpen) return;

    // Tab key navigation within modal
    if (event.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  if (!showModal) return null;

  const overlayClasses = twMerge(
    'fixed inset-0 z-50 overflow-y-auto',
    'bg-black bg-opacity-50 backdrop-blur-sm',
    'transition-opacity duration-200 ease-out',
    isAnimating ? 'opacity-100' : 'opacity-0',
    overlayClassName
  );

  const modalClasses = twMerge(
    'flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'
  );

  const contentClasses = twMerge(
    'relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all duration-200 ease-out',
    'w-full sm:my-8 sm:w-full',
    sizes[size],
    'transform transition-all duration-200 ease-out',
    isAnimating
      ? 'translate-y-0 opacity-100 sm:scale-100'
      : 'translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95',
    className,
    contentClassName
  );

  const headerClasses = twMerge(
    'px-4 py-3 sm:px-6 sm:py-5 border-b border-gray-200',
    headerClassName
  );

  const bodyClasses = twMerge(
    'px-4 py-3 sm:px-6 sm:py-5',
    bodyClassName
  );

  const footerClasses = twMerge(
    'px-4 py-2.5 sm:px-6 sm:py-3 sm:flex sm:flex-row-reverse border-t border-gray-200 bg-gray-50',
    footerClassName
  );

  return (
    <div
      className={overlayClasses}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      role="dialog"
      {...props}
    >
      <div className={modalClasses}>
        <div
          ref={modalRef}
          className={contentClasses}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-gray-700">Loading...</span>
              </div>
            </div>
          )}

          {/* Header */}
          {(title || subtitle || showCloseButton) && (
            <div className={headerClasses}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {title && (
                    <h3
                      id="modal-title"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {title}
                    </h3>
                  )}
                  {subtitle && (
                    <p className="mt-1 text-sm text-gray-500">
                      {subtitle}
                    </p>
                  )}
                </div>

                {showCloseButton && !persistent && (
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Close modal"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Body */}
          <div className={bodyClasses}>
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className={footerClasses}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Modal sub-components
Modal.Header = ({ children, className = '', ...props }) => (
  <div className={twMerge('px-4 py-5 sm:px-6 border-b border-gray-200', className)} {...props}>
    {children}
  </div>
);

Modal.Body = ({ children, className = '', ...props }) => (
  <div className={twMerge('px-4 py-5 sm:p-6', className)} {...props}>
    {children}
  </div>
);

Modal.Footer = ({ children, className = '', ...props }) => (
  <div className={twMerge('px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200 bg-gray-50', className)} {...props}>
    {children}
  </div>
);

Modal.Title = ({ children, className = '', ...props }) => (
  <h3 className={twMerge('text-lg font-medium leading-6 text-gray-900', className)} {...props}>
    {children}
  </h3>
);

Modal.Subtitle = ({ children, className = '', ...props }) => (
  <p className={twMerge('mt-1 text-sm text-gray-500', className)} {...props}>
    {children}
  </p>
);

// Confirmation Modal
Modal.Confirm = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  loading = false,
  ...props
}) => {
  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title={title}
      loading={loading}
      persistent={loading}
      {...props}
    >
      <div className="mt-2">
        <p className="text-sm text-gray-500">{message}</p>
      </div>

      <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={loading}
          className={twMerge(
            'inline-flex w-full justify-center rounded-md px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed',
            confirmVariant === 'danger' && 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
            confirmVariant === 'primary' && 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
            confirmVariant === 'success' && 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
          )}
        >
          {loading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default Modal;
