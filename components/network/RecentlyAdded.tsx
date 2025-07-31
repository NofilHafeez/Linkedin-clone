'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import RecentlyAddedSkeleton from '../skeleton/RecentlyAddedSkeleton';
import { ConnectionRequest } from '@/types/connection';

export default function RecentlyAdded() {
  const [recentConnections, setRecentConnections] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecentConnections = async () => {
      try {
        const { data, status } = await axios.get(`/api/connections/recent?userId=${user?.id}`, {
          withCredentials: true,
        });
        if (status === 200) setRecentConnections(data);
      } catch (error) {
        console.error('Failed to fetch recent connections:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchRecentConnections();
  }, [user?.id]);

  if (loading) return <RecentlyAddedSkeleton />;

  return (
    <div className="bg-zinc-800 rounded-lg shadow-sm border border-zinc-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Recently added</h2>
      </div>

      <div className="space-y-4">
        {recentConnections.map((connection) => {
          const otherUser =
            connection.requesterId === user?.id ? connection.receiver : connection.requester;

          return (
            <div
              key={connection.id}
              className="flex items-center space-x-4 p-3 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={otherUser.profilePic || '/default.jpg'}
                  alt={otherUser.name || 'User'}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-white hover:text-blue-400 cursor-pointer">
                  {otherUser.name}
                </h3>
                <p className="text-gray-400 text-sm">{otherUser.title || 'No title provided'}</p>
                <p className="text-gray-500 text-xs">
                  Connected on {new Date(connection.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
