'use client';

import { Users, UserPlus, Calendar, Building } from 'lucide-react';

export default function NetworkSidebar() {
  const networkStats = [
    { label: 'Connections', count: 1247, icon: Users },
    { label: 'Following', count: 89, icon: UserPlus },
    { label: 'Events', count: 12, icon: Calendar },
    { label: 'Companies', count: 34, icon: Building },
  ];

  return (
    <div className="space-y-6">
      {/* Manage Network */}
      <div className="bg-zinc-800 rounded-lg shadow-sm border border-zinc-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Manage my network</h2>
        
        <div className="space-y-4">
          {networkStats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between hover:bg-zinc-700 p-2 rounded-lg cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <stat.icon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">{stat.label}</span>
              </div>
              <span className="text-blue-400 font-semibold">{stat.count.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-zinc-800 rounded-lg shadow-sm border border-zinc-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick actions</h3>
        
        <div className="space-y-3">
          <button className="w-full text-left p-3 hover:bg-zinc-700 rounded-lg transition-colors">
            <span className="text-gray-300">Find alumni</span>
          </button>
          <button className="w-full text-left p-3 hover:bg-zinc-700 rounded-lg transition-colors">
            <span className="text-gray-300">Import contacts</span>
          </button>
          <button className="w-full text-left p-3 hover:bg-zinc-700 rounded-lg transition-colors">
            <span className="text-gray-300">Find colleagues</span>
          </button>
        </div>
      </div>
    </div>
  );
}