'use client';

import Header from '@/../components/layout/Header';
import NetworkSidebar from '@/../components/network/NetworkSideBar';
import ConnectionRequests from '@/../components/network/ConnectionRequests';
import PeopleYouMayKnow from '@/../components/network/PeopleYouMayKnow';
import RecentlyAdded from '@/../components/network/RecentlyAdded';

export default function NetworkPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <NetworkSidebar />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="space-y-6">
              <ConnectionRequests />
              <PeopleYouMayKnow />
              <RecentlyAdded />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}