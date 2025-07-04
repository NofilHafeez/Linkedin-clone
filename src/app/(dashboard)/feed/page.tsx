'use client';

import Header from '@/../components/layout/Header';
import Sidebar from '@/../components/layout/SideBar';
import Feed from '@/../components/post/Feed';
import RightSidebar from '@/../components/layout/RightSideBar';

export default function feedPage() {
  return (
    <div className="min-h-screen bg-zinc-black">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <Sidebar />
          </div>
          
          {/* Main Feed */}
          <div className="lg:col-span-6">
            <Feed />
          </div>
          
          {/* Right Sidebar */}
          <div className="lg:col-span-3">
            <RightSidebar />
          </div>
        </div> 
      </div>
    </div>
  );
}