
import React from 'react';
import type { NotificationType } from '../types';

interface NotificationProps {
  notification: NotificationType | null;
}

const Notification: React.FC<NotificationProps> = ({ notification }) => {
  if (!notification) return null;

  const baseClasses = "fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-2xl text-white font-semibold transition-all duration-300";
  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500 text-black',
    info: 'bg-blue-500'
  };

  return (
    <div className={`${baseClasses} ${typeClasses[notification.type]}`}>
      {notification.message}
    </div>
  );
};

export default Notification;
