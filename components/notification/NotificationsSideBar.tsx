'use client';

import { Settings, Filter, Bell, BellOff } from 'lucide-react';

export default function NotificationsSidebar() {
  const notificationSettings = [
    { label: 'Posts and comments', enabled: true },
    { label: 'Job alerts', enabled: true },
    { label: 'Network updates', enabled: false },
    { label: 'Messages', enabled: true },
    { label: 'Event invitations', enabled: true },
    { label: 'Company updates', enabled: false },
  ];

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <div className="bg-zinc-800 rounded-lg shadow-sm border border-zinc-700 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-white">Settings</h3>
        </div>
        
        <div className="space-y-4">
          {notificationSettings.map((setting, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">{setting.label}</span>
              <button
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  setting.enabled ? 'bg-blue-600' : 'bg-zinc-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    setting.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="bg-zinc-800 rounded-lg shadow-sm border border-zinc-700 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-white">Filter</h3>
        </div>
        
        <div className="space-y-2">
          <button className="w-full text-left p-2 text-blue-400 bg-blue-500/10 rounded-lg">
            All notifications
          </button>
          <button className="w-full text-left p-2 text-gray-300 hover:bg-zinc-700 rounded-lg transition-colors">
            Unread only
          </button>
          <button className="w-full text-left p-2 text-gray-300 hover:bg-zinc-700 rounded-lg transition-colors">
            Mentions
          </button>
          <button className="w-full text-left p-2 text-gray-300 hover:bg-zinc-700 rounded-lg transition-colors">
            My posts
          </button>
        </div>
      </div>

      {/* Notification Stats */}
      <div className="bg-zinc-800 rounded-lg shadow-sm border border-zinc-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">This week</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">New notifications</span>
            <span className="text-blue-400 font-semibold">23</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Profile views</span>
            <span className="text-blue-400 font-semibold">89</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Post impressions</span>
            <span className="text-blue-400 font-semibold">1.2K</span>
          </div>
        </div>
      </div>
    </div>
  );
}