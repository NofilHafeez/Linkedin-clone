'use client';

import { Send, Paperclip, Smile, MoreHorizontal, Phone, Video, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

let socket: Socket;

interface Message {
  id?: string;
  text: string;
  senderId: string;
  receiverId: string;
  time?: string;
  isOwn?: boolean;
  avatar?: string;
}

export default function ChatWindow() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<Message[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    socket = io('http://localhost:4000');

    socket.on('connect', () => {
      console.log('✅ Connected to WS server:', socket.id);
    });

    socket.on('receive-message', (data: Message) => {
      setChat((prev) => [...prev, { ...data, isOwn: data.senderId === user.id }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user?.id) return;

    try {
      const res = await axios.post('/api/messages', {
        senderId: user.id,
        text: message,
      });

      const savedMessage = res.data.message;

      // Emit via WebSocket
      socket.emit('send-message', savedMessage);

      // Update local chat
      setChat((prev) => [...prev, { ...savedMessage, isOwn: true }]);
      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="bg-zinc-800 rounded-lg shadow-sm border border-zinc-700 h-full flex flex-col">
      
      {/* Header */}
      <div className="p-4 border-b border-zinc-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-zinc-800 rounded-full" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Chat</h3>
            <p className="text-sm text-green-400">Active now</p>
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${msg.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img src={msg.avatar ?? '/default-profile.png'} alt="avatar" className="w-full h-full object-cover" />
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
