'use client';

import { Search, Home, Users, MessageSquare, Bell, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useNotification } from '../../context/NotificationContext';

export default function Header() {
  const [activeTab, setActiveTab] = useState('home');
  const { user } = useAuth();
  const router = useRouter();
  const { count } = useNotification(); // ✅ Only call it once

  useEffect(() => {
    console.log('✅ Notification count in Header:', count);
  }, [count]); // log only when it changes

  const navItems = [
    { id: 'feed', icon: Home, label: 'Home' },
    { id: 'network', icon: Users, label: 'My Network' },
    { id: 'messages', icon: MessageSquare, label: 'Messaging' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: user ? `profile/${user.id}` : 'profile', icon: User, label: 'Me' },
  ];

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-zinc-900 shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo and Search */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded text-white flex items-center justify-center font-bold text-sm">
              in
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                className="w-64 pl-10 bg-zinc-700 pr-4 py-2 rounded-md text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-1 relative">
            {navItems.map((item) => {
              const isNotification = item.label === 'Notifications';
              if (item.label === 'Me') {
                return (
                  <div key={item.id} className="relative">
                    <button
                      onClick={() => setActiveTab(activeTab === item.id ? '' : item.id)}
                      className={`flex flex-col items-center px-3 py-2 text-xs transition-colors ${
                        activeTab === item.id
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-300 hover:text-white cursor-pointer'
                      }`}
                    >
                      <item.icon className="w-5 h-5 mb-1" />
                      <span className="hidden sm:block">{item.label}</span>
                    </button>

                    {activeTab === item.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-zinc-800 border border-gray-700 rounded-lg z-50">
                        <Link href={`/profile/${user?.id}`}>
                          <button className="w-full text-left px-4 py-2 hover:bg-zinc-700 text-gray-200">
                            View My Profile
                          </button>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-red-500"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link href={`/${item.id}`} key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`relative flex flex-col items-center px-3 py-2 text-xs transition-colors ${
                      activeTab === item.id
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-300 hover:text-white cursor-pointer'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mb-1" />
                    {isNotification && count > 0 && (
                      <span className="absolute -top-0.5 ml-4 bg-red-600 text-white text-[10px] font-bold px-0.5 py-0.5 rounded-full">
                        {count > 9 ? '9+' : count}
                      </span>
                    )}
                    <span className="hidden sm:block">{item.label}</span>
                  </button>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
