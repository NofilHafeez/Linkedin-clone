'use client';

import { Search, Edit, MoreHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import MessageSidebarSkeleton from '../skeleton/MessageSidebarSkeleton';

interface ConnectedUser {
  id: string;
  name: string;
  profilePic: string;
  title: string;
}

interface Room {
  id: string;
  users: ConnectedUser[];
  
}

interface Room {
  id: string;
  users: ConnectedUser[];
}


export default function MessageSidebar({ onRoomSelect }: { onRoomSelect: (roomId: string, otherUser: ConnectedUser) => void; }) {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [connections, setConnections] = useState<ConnectedUser[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetchConnections();
    fetchRooms();
  }, [user?.id]);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(`/api/connections/recent?userId=${user?.id}`);
       if (res.status === 200 && Array.isArray(res.data)) {
        const users = res.data.map((conn: any) => {
          if (!conn.requester || !conn.receiver) return null;

          if (!user) return null;
          return conn.requesterId === user.id ? conn.receiver : conn.requester;
        }).filter(Boolean); // Removes nulls

      setConnections(users);
    }
  } catch (err) {
    console.error('Error fetching connections:', err);
  } finally {
    setLoading(false);
  }
  };

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`/api/room?userId=${user?.id}`);
      setRooms(res.data);
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSelect = async (selectedUserId: string) => {
  try {
    const res = await axios.post('/api/room', {
      userIds: [user?.id, selectedUserId],
    });
    
    const createdRoom = res.data.room;
    const otherUser = connections.find((c) => c.id === selectedUserId);


    if (!otherUser) return;

    onRoomSelect(createdRoom.id, otherUser);
    setSearch('');
    setShowDropdown(false);
    fetchRooms();
  } catch (err) {
    console.error('Error creating room:', err);
  }
};

  const filteredConnections = connections.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <MessageSidebarSkeleton />;
  } 

  return (
    <div className="bg-zinc-900 rounded-lg shadow-sm border border-zinc-700 h-full flex flex-col">
      <div className="p-4 border-b border-zinc-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Messaging</h2>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search connections"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(e.target.value.length > 0);
            }}
            className="w-full pl-10 pr-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-sm text-white placeholder-gray-400"
          />

          {showDropdown && filteredConnections.length > 0 && (
            <div className="absolute left-0 right-0 bg-zinc-700 border border-zinc-600 mt-1 rounded-lg z-10 max-h-60 overflow-y-auto">
              {filteredConnections.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSearchSelect(c.id)}
                  className="p-2 hover:bg-zinc-600 cursor-pointer flex items-center space-x-2"
                >
                  <img src={c.profilePic || '/default-profile.png'} alt={c.name} className="w-8 h-8 rounded-full object-cover" />
                  <span className="text-white text-sm">{c.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {rooms.length === 0 ? (
          <p className="text-gray-400 text-center mt-4">No conversations yet</p>
        ) : (
          rooms.map((room) => {
            const otherUser = room.users.find((p) => p.id !== user?.id);
            if (!otherUser) return null;
            return (
              <div
                key={room.id}
                onClick={() => onRoomSelect(room.id, otherUser)}
                className="p-4 border-b border-zinc-700 hover:bg-zinc-700 cursor-pointer flex items-center space-x-3"
              >
                <img src={otherUser.profilePic || '/default-profile.png'} alt={otherUser.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h3 className="text-white font-medium truncate">{otherUser.name}</h3>
                  <p className="text-gray-400 text-sm truncate">{otherUser.title}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
