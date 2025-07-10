'use client';

import { Send, Paperclip, Smile, MoreHorizontal, Phone, Video, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';


interface Message {
  id?: string;
  text: string;
  senderId: string;
  createdAt?: string;
  isOwn?: boolean;
}

interface User {
  id: string;
  name: string;
  profilePic: string;
  isOnline?: boolean;
}

export default function ChatWindow({ roomId, otherUser }: { roomId: string; otherUser: User }) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<Message[]>([]);
  const { user } = useAuth();
  const socket = useSocket();

  useEffect(() => {
    if (!user?.id || !roomId) return;

    fetchMessages();

    if (!socket) return;

    // socket.on('connect', () => {
    //   console.log('✅ Connected to WS server:', socket.id);
    // });

    socket.emit('join-room', roomId);

    socket.on('receive-message', (data: Message) => {
      setChat((prev) => [
        ...prev,
        {
          ...data,
          isOwn: data.senderId === user.id,
        },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id, roomId]);

const fetchMessages = async () => {
    try {
      const res = await axios.get(`/api/messages?roomId=${roomId}`);
      const formatted = res.data.map((m: Message) => ({
        ...m,
        isOwn: m.senderId === user?.id,
      }));
      setChat(formatted);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

 const handleSendMessage = async () => {
  if (!message.trim() || !user?.id) return;
  if (!socket) return;

  const localMessage: Message = {
    text: message,
    senderId: user.id,
    createdAt: new Date().toISOString(),
    isOwn: true,
  };

  // ✅ Instantly show message in chat UI
  setChat((prev) => [...prev, localMessage]);
  setMessage('');

  try {
    const res = await axios.post('/api/messages', {
      senderId: user.id,
      text: message,
      roomId,
    });

    const savedMessage = res.data.newMessage;

    // Optionally update the sent message with server ID later if needed
    // OR just emit to others:
    socket.emit('send-message', { ...savedMessage, roomId });
  } catch (err) {
    console.error('Failed to send message:', err);
  }
};

  if (!roomId || !otherUser) {
    return (
      <div className="bg-zinc-800 rounded-lg shadow-sm border border-zinc-700 h-full flex items-center justify-center">
        <p className="text-gray-400">Please select a conversation to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-800 rounded-lg h-screen shadow-sm border border-zinc-700 h-[500px] flex flex-col">
      
      {/* Header */}
      <div className="p-4 border-b border-zinc-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={otherUser?.profilePic || '/default-profile.png'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${otherUser?.isOnline ? 'bg-green-500' : 'bg-gray-500'} border-2 border-zinc-800 rounded-full`} />
          </div>
          <div>
            <h3 className="font-semibold text-white">{otherUser?.name || 'Chat'}</h3>
            <p className={`text-sm ${otherUser?.isOnline ? 'text-green-400' : 'text-gray-400'}`}>
              {otherUser?.isOnline ? 'Active now' : 'Offline'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-zinc-700 rounded-full transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-zinc-700 rounded-full transition-colors">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-zinc-700 rounded-full transition-colors">
            <Info className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-zinc-700 rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages with proper scroll */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${msg.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img src={msg.isOwn ? user?.profilePic || '/default-profile.png' : otherUser.profilePic || '/default.jpg'} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div className={`px-4 py-2 rounded-2xl ${msg.isOwn ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-gray-100'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
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
