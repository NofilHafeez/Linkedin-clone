'use client';

import {
  Send, Paperclip, Smile, MoreHorizontal, Phone, Video, Info
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import ChatWindowSkeleton from '../skeleton/ChatWindowSkeleton';
import { User } from '@/types/index';

interface MessageLocal {
  text: string;
  senderId: string;
  createdAt: string;
}

export default function ChatWindow({ roomId, otherUser }: { roomId: string; otherUser: Partial<User> }) {
  const { user } = useAuth();
  const socket = useSocket();

  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<MessageLocal[]>([]);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!user?.id || !roomId || !socket) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/messages?roomId=${roomId}`);
        const formatted = res.data.map((msg: MessageLocal) => ({
          ...msg,
          isOwn: msg.senderId === user.id,
        }));
        setChat(formatted);
      } catch (err) {
        toast.error('Failed to fetch chat messages');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    socket.emit('join-room', roomId);

    const receiveMessage = (data: MessageLocal) => {
      setChat(prev => [...prev, { ...data, isOwn: data.senderId === user.id }]);
    };

    socket.on('receive-message', receiveMessage);

    return () => {
      socket.off('receive-message', receiveMessage);
      socket.emit('leave-room', roomId); // safer cleanup
    };
  }, [roomId, user?.id, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user?.id || !socket) return;

    const localMessage: MessageLocal = {
      text: message,
      senderId: user.id,
      createdAt: new Date().toISOString(),
    };

    setChat(prev => [...prev, localMessage]);
    setMessage('');

    try {
      const res = await axios.post('/api/messages', {
        senderId: user.id,
        text: message,
        roomId,
      });

      if (res.data?.newMessage) {
        socket.emit('send-message', { ...res.data.newMessage, roomId });
      }
    } catch (err) {
      toast.error('Failed to send message');
      console.error(err);
    }
  };

  if (!roomId || !otherUser) {
    return (
      <div className="bg-zinc-800 rounded-lg shadow-sm border border-zinc-700 h-full flex items-center justify-center">
        <p className="text-gray-400">Please select a conversation to start chatting.</p>
      </div>
    );
  }

  if (loading) return <ChatWindowSkeleton />;

  return (
    <div className="bg-zinc-900 rounded-lg shadow-sm border border-zinc-700 h-[500px] flex flex-col">
      
      {/* Header */}
      <div className="p-4 border-b border-zinc-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={otherUser.profilePic || '/default.jpg'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${otherUser.status === 'online' ? 'bg-green-500' : 'bg-gray-500'} border-2 border-zinc-800 rounded-full`} />
          </div>
          <div>
            <h3 className="font-semibold text-white">{otherUser.name}</h3>
            <p className={`text-sm ${otherUser.status === 'online' ? 'text-green-400' : 'text-gray-400'}`}>
              {otherUser.status === 'online' ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {[Phone, Video, Info, MoreHorizontal].map((Icon, idx) => (
            <button
              key={idx}
              className="p-2 text-gray-400 hover:text-white hover:bg-zinc-700 rounded-full transition-colors"
            >
              <Icon className="w-5 h-5" />
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${msg.senderId === user?.id? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={msg.senderId === user?.id ? user?.profilePic || '/default.jpg' : otherUser.profilePic || '/default.jpg'}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={`px-4 py-2 rounded-2xl ${msg.senderId === user?.id ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-gray-100'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-zinc-700">
        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-zinc-700 rounded-full transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a message..."
              className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
              <Smile className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
