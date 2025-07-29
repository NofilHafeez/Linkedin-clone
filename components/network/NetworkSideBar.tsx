'use client';

import { Users, UserPlus, Calendar, Building } from 'lucide-react';
import NetworkSideBarSkeleton from '../skeleton/NetworkSidebarSkeleton';

export default function NetworkSidebar() {


  return (
    <div className="space-y-6">
      {/* Manage Network */}
      <div className="bg-zinc-800 rounded-lg shadow-sm border border-zinc-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Manage my network</h2>
        
        <div className="space-y-4">
            <div className="flex items-center justify-between hover:bg-zinc-700 p-2 rounded-lg cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">Following</span>
              </div>
              <span className="text-blue-400 font-semibold">0</span>
            </div>
        </div>
      </div>
    </div>
  );
}