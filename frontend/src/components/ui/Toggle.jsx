import { useState } from 'react';
import { cn } from '../../lib/utils';

const Toggle = ({ 
  checked = false, 
  onChange, 
  disabled = false, 
  label = '',
  description = '',
  className = '' 
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <div className="flex-1 min-w-0">
        {label && (
          <label className="text-sm font-medium text-gray-900">
            {label}
          </label>
        )}
        {description && (
          <p className="text-sm text-gray-500 mt-0.5 sm:mt-1">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          'relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:h-6 sm:w-11',
          isChecked ? 'bg-blue-600' : 'bg-gray-200',
          disabled ? 'cursor-not-allowed opacity-50' : ''
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out sm:h-5 sm:w-5',
            isChecked ? 'translate-x-5 sm:translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
};

export default Toggle;