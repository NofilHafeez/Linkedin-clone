'use client';

import { Heart, MessageCircle, UserPlus, Briefcase, TrendingUp, Calendar, X } from 'lucide-react';
import { useState } from 'react';

export default function NotificationsList() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'like',
      icon: Heart,
      iconColor: 'text-red-500',
      user: 'Emily Watson',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      action: 'liked your post',
      content: '"Just shipped a major feature that will impact millions of users!"',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      type: 'comment',
      icon: MessageCircle,
      iconColor: 'text-blue-500',
      user: 'James Miller',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      action: 'commented on your post',
      content: 'Great insights on product management! Would love to connect.',
      time: '4 hours ago',
      unread: true
    },
    {
      id: 3,
      type: 'connection',
      icon: UserPlus,
      iconColor: 'text-green-500',
      user: 'Lisa Chen',
      avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      action: 'accepted your connection request',
      content: null,
      time: '1 day ago',
      unread: false
    },
    {
      id: 4,
      type: 'job',
      icon: Briefcase,
      iconColor: 'text-purple-500',
      user: 'TechCorp',
      avatar: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      action: 'posted a new job that matches your profile',
      content: 'Senior Product Manager - Remote',
      time: '2 days ago',
      unread: false
    },
    {
      id: 5,
      type: 'mention',
      icon: TrendingUp,
      iconColor: 'text-orange-500',
      user: 'David Kim',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      action: 'mentioned you in a post',
      content: 'Thanks to @Sarah Johnson for the amazing product insights!',
      time: '3 days ago',
      unread: false
    },
    {
      id: 6,
      type: 'event',
      icon: Calendar,
      iconColor: 'text-indigo-500',
      user: 'Product Management Summit',
      avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      action: 'event reminder',
      content: 'Product Management Best Practices - Tomorrow at 2 PM',
      time: '1 week ago',
      unread: false
    }
  ]);

  const handleDismiss = (id: number) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, unread: false } : notif
    ));
  };

  return (
    <div className="bg-zinc-800 rounded-lg shadow-sm border border-zinc-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Notifications</h2>
        <button className="text-blue-400 hover:underline text-sm">
          Mark all as read
        </button>
      </div>
      
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border transition-colors cursor-pointer ${
              notification.unread 
                ? 'bg-zinc-700 border-blue-500/30 hover:bg-zinc-600' 
                : 'bg-zinc-800 border-zinc-600 hover:bg-zinc-700'
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="flex items-start space-x-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={notification.avatar}
                    alt={notification.user}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center`}>
                  <notification.icon className={`w-3 h-3 ${notification.iconColor}`} />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-white">
                      <span className="font-semibold hover:text-blue-400 cursor-pointer">
                        {notification.user}
                      </span>
                      <span className="text-gray-300 ml-1">{notification.action}</span>
                    </p>
                    
                    {notification.content && (
                      <p className="text-gray-400 text-sm mt-1 italic">
                        {notification.content}
                      </p>
                    )}
                    
                    <p className="text-gray-500 text-xs mt-2">{notification.time}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {notification.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDismiss(notification.id);
                      }}
                      className="text-gray-400 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="text-blue-400 hover:underline">
          View all notifications
        </button>
      </div>
    </div>
  );
}