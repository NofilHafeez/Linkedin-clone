'use client';


import { useAuth } from '../../context/AuthContext';
import Image from 'next/image';


export default function Sidebar() {
  const { user } = useAuth();
    if (!user) return null; 

  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <div className="bg-zinc-900 rounded-lg  overflow-hidden">
        <div className="h-16 bg-zinc-700 relative">
           <Image
            src={user.bannerPic || '/default-banner.jpg'}
            alt="Banner"
            fill
            className="w-full h-full object-cover"
          />
          <div className="absolute -bottom-8 left-14 transform -translate-x-1/2">
            <div className="w-16 h-16 rounded-full bg-gray-300 border-1 border-white overflow-hidden">
              <Image
                src={user.profilePic || '/default.jpg'}
                alt="Profile"
                width={64}
                height={64}
                className="w-full rounded-full h-full object-cover"
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
            <span className="text-blue-400 font-semibold">{user.viewedProfile}</span>
          </div>
          <div className="flex justify-between items-center text-sm mt-2">
          </div>
        </div>  
      </div>

    </div>
  );
}