'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useNotification } from '../../context/NotificationContext';



export interface UserBasic {
  id: string;
  name: string;
  profilePic: string | null;
}

interface Notification {
  id: number;
  userId: string;
  message: string;
  isRead: boolean;
  sender: UserBasic;
  createdAt: string;
}

export default function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const socket = useSocket();
  const {setCount} = useNotification();
  

  useEffect(() => {
    if (!user?.id) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`/api/notifications?userId=${user.id}`, { withCredentials: true });
        if (res.status === 200) {
           const all = res.data;
           const unread = all.filter((n: Notification) => !n.isRead);
           setNotifications(all);
           setCount(unread.length); 
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    return () => {
      axios.put('/api/notifications', { userId: user.id }, { withCredentials: true })
        .then(() => console.log('Notifications marked as read'))
        .catch((err) => console.error('Error marking notifications as read:', err));
    };
  }, [user?.id]);

// useEffect(() => {
//   if (!socket || !user?.id) return;

//   // Join private room based on user ID
//   socket.emit('join-room', user.id);
// }, [socket, user?.id]);

useEffect(() => {
  if (!socket || !user?.id) return;

  // Join user-specific room
  socket.emit('join-room', user.id);
   console.log('Emitted join-room for user', user.id);


   socket.on('comment-noti-receive', ({ message, sender }) => {
    console.log('🔥 Received noti:', message, sender);
    const newNotification = {
      id: Date.now(),
      message,
      sender,
      isRead: false,
      createdAt: new Date().toISOString(),
      userId: user.id,
    };
    
    setNotifications((prev) => [newNotification, ...prev]);
    setCount((prev) => prev + 1);

  });

  // Listen for incoming like notifications
  socket.on('like-noti-receive', ({ message, sender }) => {
    console.log('🔥 Received noti:', message, sender);
    const newNotification = {
      id: Date.now(),
      message,
      sender,
      isRead: false,
      createdAt: new Date().toISOString(),
      userId: user.id,
    };
    
    setNotifications((prev) => [newNotification, ...prev]);
    setCount((prev) => prev + 1);

  });

  socket.on('connect-noti-receive', ({ message, sender }) => {
    console.log('🔥 Received noti:', message, sender);
    const newNotification = {
      id: Date.now(),
      message,
      sender,
      isRead: false,
      createdAt: new Date().toISOString(),
      userId: user.id,
    };
    
    setNotifications((prev) => [newNotification, ...prev]);
    setCount((prev) => prev + 1);

  });




  return () => {
    socket.off('like-noti-receive');
    socket.off('comment-noti-receive');
    socket.off('connect-noti-receive');


  };
}, [socket, user?.id]);


  return (
    <div className="bg-zinc-800 rounded-lg shadow-sm border border-zinc-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Notifications</h2>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border transition-colors cursor-default ${
              !notification.isRead
                ? 'bg-zinc-700 border-blue-500/30 hover:bg-zinc-600'
                : 'bg-zinc-800 border-zinc-600 hover:bg-zinc-700'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={notification.sender.profilePic || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'}
                    alt={notification.sender.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white">
                  <span className="font-semibold hover:text-blue-400 cursor-pointer">
                    {notification.sender.name}
                  </span>
                </p>

                {notification.message && (
                  <p className="text-gray-400 text-sm mt-1 italic">
                    {notification.message}
                  </p>
                )}

                <p className="text-gray-500 text-xs mt-2">{notification.createdAt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
