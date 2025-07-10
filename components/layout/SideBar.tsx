'use client';


import { useAuth } from '../../context/AuthContext';

import { Camera, Users, Eye, Bookmark } from 'lucide-react';

interface User {
  id: string;
  name: string;
  title: string;
  profilePic: string;
  bannerPic: string;
  location: string;
} 

export default function Sidebar() {
  const profileViews = 1247;
  const postImpressions = 3892;

  const { user } = useAuth();
    if (!user) return null; 

  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <div className="bg-zinc-900 rounded-lg  overflow-hidden">
        <div className="h-16 bg-zinc-700 relative">
           <img
            src={user.bannerPic || 'https://via.placeholder.com/800x200'}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute -bottom-8 left-14 transform -translate-x-1/2">
            <div className="w-16 h-16 rounded-full bg-gray-300 border-1 border-white overflow-hidden">
              <img
                src={user.profilePic || '/default.jpg'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-10 pb-4 px-6 text-center">
          <h3 className="font-semibold text-left text-white">{user?.name ?? ''}</h3>
          <p className="text-xs text-gray-300 text-left mt-1 ">{user?.title ?? 'No Title'}</p>
          <p className="text-xs text-gray-500 text-left mt-0.5 ">{user?.location ?? 'No Location'}</p>
        </div>
        
        <div className="border-t px-6 py-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-white">Profile viewers</span>
            <span className="text-blue-400 font-semibold">{profileViews.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm mt-2">
            <span className="text-white">Post impressions</span>
            <span className="text-blue-400 font-semibold">{postImpressions.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="border-t px-6 py-3">
          <button className="text-sm text-white hover:text-blue-600 transition-colors">
            Access exclusive tools & insights
          </button>
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="bg-zinc-900 rounded-lg p-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm text-white hover:text-blue-600 cursor-pointer transition-colors">
            <Users className="w-4 h-4" />
            <span>Groups</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-white hover:text-blue-600 cursor-pointer transition-colors">
            <Eye className="w-4 h-4" />
            <span>Events</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-white hover:text-blue-600 cursor-pointer transition-colors">
            <Bookmark className="w-4 h-4" />
            <span>Saved items</span>
          </div>
        </div>
      </div>
    </div>
  );
}