'use client';

import { useEffect, useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import NotificationsListSkeleton from '../skeleton/NotificationsListSkeleton';


export default function NotificationsList() {
    const { notifications, setCount, loading } = useNotification();
    const {user} = useAuth();

  useEffect(() => {
     axios.put('/api/notifications', { userId: user?.id }, { withCredentials: true })
        .then(() => console.log('Notifications marked as read'))
        .catch((err) => console.error('Error marking notifications as read:', err));
    
    setCount(0); // reset badge when opening
  }, [setCount]);


  function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // in seconds

  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

if (loading) {
  return <NotificationsListSkeleton />;
}


  return (
  <div className="bg-zinc-900 rounded-lg shadow-sm w-full">
    {notifications.map((notification) => (
      <div
        key={notification.id}
        className={`flex items-start  border-1 justify-between gap-3 px-4 py-3 border-b border-zinc-800 group cursor-pointer transition-colors ${
          !notification.isRead ? 'bg-zinc-800 border-1 border-b border-zinc-900  hover:bg-zinc-700' : 'hover:bg-zinc-800'
        }`}
      >
        {/* Avatar + Content */}
        <div className="flex items-start gap-3 flex-1">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={notification.sender.profilePic || '/default.jpg'}
              alt={notification.sender.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Message */}
          <div className="flex-1 text-sm text-gray-300">
            <p>
              <span className="font-semibold text-white hover:text-blue-400">
                {notification.sender.name}
              </span>{' '}
              {notification.message}
            </p>
          </div>
        </div>

        {/* Time */}
        <div className="text-xs text-gray-500 whitespace-nowrap pl-2 pt-1 min-w-fit">
          {getTimeAgo(notification.createdAt)}
        </div>
      </div>
    ))}
  </div>
);

}
 