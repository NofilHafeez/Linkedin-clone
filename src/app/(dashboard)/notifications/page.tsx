'use client';

import Header from '@/../components/layout/Header';
import NotificationsList from '@/../components/notification/NotificationsList';
import Sidebar from '../../../../components/layout/SideBar';

export default function NotificationsPage() { 
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-14 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <Sidebar />
          </div>
          {/* Main Notifications */}
          <div className="lg:col-span-8">
            <NotificationsList />
          </div>

          {/* Footer Links */}
          <div className="lg:col-span-3">
      <div className="rounded-lg  p-4">
        <div className="text-xs text-gray-500 space-y-2">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <a href="#" className="hover:text-blue-600 transition-colors">About</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Accessibility</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Help Center</a>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy & Terms</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Ad Choices</a>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <a href="#" className="hover:text-blue-600 transition-colors">Advertising</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Business Services</a>
          </div>
          <div className="pt-2 border-t">
            <span className="text-white">LinkedIn Corporation © 2025</span>
          </div>
        </div>
      </div>
      </div>

        </div>
      </div>
    </div>
  );
}