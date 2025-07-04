'use client';

import Header from '@/../components/layout/Header';
import NotificationsList from '@/../components/notification/NotificationsList';
import NotificationsSidebar from '@/../components/notification/NotificationsSideBar';

export default function NotificationsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Notifications */}
          <div className="lg:col-span-8">
            <NotificationsList />
          </div>
          
          {/* Notifications Sidebar */}
          <div className="lg:col-span-4">
            <NotificationsSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}