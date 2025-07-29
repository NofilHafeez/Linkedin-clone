'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { useAuth, } from './AuthContext';

export enum Status {
  online = 'online',
  offline = 'offline',
  away = 'away',
}


export interface UserBasic {
  id: string;
  name: string;
  profilePic: string | null;
  status: Status;
}

export interface Notification {
  id: number;
  userId: string;
  message: string;
  isRead: boolean;
  sender: UserBasic;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const socket = useSocket();
  const { user, setUser, fetchUser } = useAuth();
  const [loading, setLoading] = useState(true);
 
  // Join socket room
  useEffect(() => {
    if (socket && user?.id) {
      socket.emit('join-room', user.id);
      console.log('✅ Joined socket room:', user.id);
    }
    
  }, [socket, user?.id]);

  useEffect(() => {
  if (socket && user?.id) {
    socket.emit('set-user-id', user.id); // for disconnect logic
    socket.emit('user-status', { userId: user.id, status: 'online' });
  }

  const handleUnload = () => {
    socket?.emit('user-status', { userId: user?.id, status: 'offline' });
  };

  window.addEventListener('beforeunload', handleUnload);

  return () => {
    window.removeEventListener('beforeunload', handleUnload);
    socket?.emit('user-status', { userId: user?.id, status: 'offline' });
  };
}, [user?.id, socket]);

useEffect(() => {
  if (!socket || !user?.id) return;

  const handleStatusChange = ({ userId, status }: { userId: string; status: string }) => {
    // Only update if the status is for the current user
    if (userId === user.id) {
      setUser(prev => prev ? { ...prev, status: status as Status } : prev);
    }
  };

  socket.on('user-status-change', handleStatusChange);
  fetchUser();

  return () => {
    socket.off('user-status-change', handleStatusChange);
  };
}, [socket, user?.id]);





  

  // Fetch notifications initially
  useEffect(() => {
    if (!user?.id) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`/api/notifications?userId=${user.id}`, { credentials: 'include' });
        const all = await res.json();
        const unread = all.filter((n: Notification) => !n.isRead);
        setNotifications(all);
        setCount(unread.length);
      } catch (err) {
        console.error('❌ Error fetching notifications:', err);
      } finally{ 
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user?.id]);

  // Real-time updates
  useEffect(() => {
    if (!socket || !user?.id) return;

    const handleReceive = ({ message, sender, receiverId }: any) => {
      if (receiverId !== user.id) return;

      const newNotification: Notification = {
        id: Date.now(),
        message,
        sender,
        isRead: false,
        createdAt: new Date().toISOString(),
        userId: user.id
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setCount((prev) => prev + 1);
    };

    socket.on('like-noti-receive', handleReceive);
    socket.on('comment-noti-receive', handleReceive);
    socket.on('connect-noti-receive', handleReceive);

    return () => {
      socket.off('like-noti-receive', handleReceive);
      socket.off('comment-noti-receive', handleReceive);
      socket.off('connect-noti-receive', handleReceive);
    };
  }, [socket, user?.id]);

  return (
    <NotificationContext.Provider value={{ count, setCount, notifications, loading, setLoading }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
