import { FiX, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';

const Alert = ({ type = 'info', message, onClose, className = '' }) => {
  const alertTypes = {
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      icon: <FiCheckCircle className="w-5 h-5 text-green-400" />,
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      icon: <FiAlertCircle className="w-5 h-5 text-red-400" />,
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      icon: <FiAlertCircle className="w-5 h-5 text-yellow-400" />,
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      icon: <FiInfo className="w-5 h-5 text-blue-400" />,
    },
  };

  const currentType = alertTypes[type] || alertTypes.info;

  return (
    <div className={`${currentType.bgColor} ${currentType.borderColor} border rounded-lg p-3 sm:p-4 ${className}`}>
      <div className="flex items-start sm:items-center">
        <div className="flex-shrink-0">
          {currentType.icon}
        </div>
        <div className="ml-2 sm:ml-3 flex-1">
          <p className={`text-sm ${currentType.textColor}`}>
            {message}
          </p>
        </div>
        {onClose && (
          <div className="ml-auto pl-2 sm:pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={onClose}
                className={`inline-flex rounded-md p-1 ${currentType.textColor} hover:bg-black hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:p-1.5`}
              >
                <span className="sr-only">Dismiss</span>
                <FiX className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;