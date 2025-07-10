// 'use client';

// import { useEffect } from 'react';
// import { useNotification } from '../context/NotificationContext';
// import { useAuth } from '../context/AuthContext';
// import { useSocket } from '../context/SocketContext';
// import axios from 'axios';

// export default function NotificationInitializer() {
//   const { setCount } = useNotification();
//   const { user } = useAuth();
//   const socket = useSocket();

//   useEffect(() => {
//     if (!user?.id) return;

//     // Fetch unread notifications once on load
//     axios.get(`/api/notifications?userId=${user.id}`).then((res) => {
//       const unread = res.data.filter((n: any) => !n.isRead);
//       setCount(unread.length);
//       console.log('📩 Unread count set to:', unread.length);
//     });
//   }, [user?.id]);

//   useEffect(() => {
//     if (!socket || !user?.id) return;

//     socket.emit('join-room', user.id);
//     console.log('📡 Joined socket room for user:', user.id);

//     const handleNew = ({ message, sender }: any) => {
//       console.log('🔥 New notification received:', message);
//       setCount((prev) => prev + 1);
//     };

//     socket.on('like-noti-receive', handleNew);
//     socket.on('comment-noti-receive', handleNew);
//     socket.on('connect-noti-receive', handleNew);

//     return () => {
//       socket.off('like-noti-receive', handleNew);
//       socket.off('comment-noti-receive', handleNew);
//       socket.off('connect-noti-receive', handleNew);
//     };
//   }, [socket, user?.id]);

//   return null;
// }
