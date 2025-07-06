'use client';

import Header from '@/../components/layout/Header';
import MessageSidebar from '@/../components/message/MessageSideBar';
import ChatWindow from '@/../components/message/ChatWindow';
import { useState } from 'react';

export default function MessagingPage() {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [otherUser, setOtherUser] = useState<any | null>(null); 
  return (
    <div className="min-h-screen">
      <Header />

      <div className="m ax-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-120px)]">
          {/* Message Sidebar */}
          <div className="lg:col-span-4">
            <MessageSidebar
            onRoomSelect={(roomId, user) => {
              setSelectedRoomId(roomId);
              setOtherUser(user);
            }}
          /> 
          </div>
          
          {/* Chat Window */}
          <div className="lg:col-span-8">
            <ChatWindow  roomId={selectedRoomId ?? ''} otherUser={otherUser} />
          </div>
        </div>
      </div>
    </div>
  );
}