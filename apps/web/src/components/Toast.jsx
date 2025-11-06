import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

function Toast({ 
  isVisible, 
  onClose, 
  message, 
  type = 'info', // success, error, warning, info
  duration = 4000,
  position = 'top-right' // top-right, top-left, bottom-right, bottom-left
}) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-600',
          borderColor: 'border-green-500',
          iconColor: 'text-green-200'
        };
      case 'error':
        return {
          icon: XCircle,
          bgColor: 'bg-red-600',
          borderColor: 'border-red-500',
          iconColor: 'text-red-200'
        };
      case 'warning':
        return {
          icon: AlertCircle,
          bgColor: 'bg-yellow-600',
          borderColor: 'border-yellow-500',
          iconColor: 'text-yellow-200'
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-blue-600',
          borderColor: 'border-blue-500',
          iconColor: 'text-blue-200'
        };
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      default:
        return 'top-4 right-4';
    }
  };

  const styles = getTypeStyles();
  const Icon = styles.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.3 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.5 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed ${getPositionStyles()} z-50 max-w-sm w-full`}
        >
          <div className={`${styles.bgColor} ${styles.borderColor} border rounded-lg shadow-lg p-4`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Icon className={`h-5 w-5 ${styles.iconColor}`} />
              </div>
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium text-white">
                  {message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={onClose}
                  className="inline-flex text-white hover:text-gray-200 focus:outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Toast;