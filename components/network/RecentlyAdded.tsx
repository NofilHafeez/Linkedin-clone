'use client';

import { MessageCircle, MoreHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface ConnectionRequest {
  id: string;
  requesterId: string;
  receiverId: string;
  status: string;
  createdAt: string;
  requester: {
    id: string;
    name: string;
    profilePic: string;
    title: string;
  };
  receiver: {
    id: string;
    name: string;
    profilePic: string;
    title: string;
  };
}

export default function RecentlyAdded() {
  const [recentConnections, setRecentConnections] = useState<ConnectionRequest[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecentConnections = async () => {
      try {
        const response = await axios.get(`/api/connections/recent?userId=${user?.id}`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setRecentConnections(response.data);
        } else {
          console.error('Failed to fetch recent connections:', response.data);
        }
      } catch (error) {
        console.error('Error fetching recent connections:', error);
      }
    };

    if (user?.id) {
      fetchRecentConnections();
    }
  }, [user?.id]);

  return (
    <div className="bg-zinc-800 rounded-lg shadow-sm border border-zinc-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Recently added</h2>
        <button className="text-blue-400 hover:underline text-sm">
          See all
        </button>
      </div>

      <div className="space-y-4">
        {recentConnections.map((connection) => {
          const otherPerson =
            connection.requesterId === user?.id ? connection.receiver : connection.requester;

          return (
            <div
              key={connection.id}
              className="flex items-center space-x-4 p-3 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={otherPerson.profilePic || '/default-profile.png'}
                  alt={otherPerson.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-white hover:text-blue-400 cursor-pointer">
                  {otherPerson.name}
                </h3>
                <p className="text-gray-400 text-sm">{otherPerson.title}</p>
                <p className="text-gray-500 text-xs">
                  Connected {new Date(connection.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-zinc-600 rounded-full transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-zinc-600 rounded-full transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
