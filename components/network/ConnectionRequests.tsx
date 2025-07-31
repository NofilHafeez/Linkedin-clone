'use client';

import { MoreHorizontal } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import ConnectionRequestsSkeleton from '../skeleton/ConnectionRequestsSkeleton';
import { Connection } from '@/types/connection';

export default function ConnectionRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { data } = await axios.get(`/api/connections/${user.id}`, {
        withCredentials: true,
      });
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching connection requests:', error);
      toast.error('Failed to fetch connection requests');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const handleResponse = async (
    connectionId: string,
    status: 'ACCEPTED' | 'DECLINED'
  ) => {
    try {
      const res = await axios.put(
        `/api/connections/respond`,
        { connectionId, status },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setRequests((prev) => prev.filter((req) => req.id !== connectionId));
        toast.success(
          status === 'ACCEPTED'
            ? 'Connection request accepted!'
            : 'Connection request declined'
        );
      }
    } catch (error) {
      console.error('Error responding to request:', error);
      toast.error('Failed to update connection request');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  if (loading) return <ConnectionRequestsSkeleton />;

  if (!requests.length) {
    return (
      <div className="bg-zinc-800 rounded-lg shadow-sm border border-zinc-700 p-6 text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Invitations</h2>
        <p className="text-gray-400">No connection requests</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-800 rounded-lg shadow-sm border border-zinc-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">
          Invitations ({requests.length})
        </h2>
        <button
          className="text-blue-400 hover:underline text-sm"
          aria-label="Manage all invitations"
        >
          Manage all
        </button>
      </div>

      <div className="space-y-6">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex items-start space-x-4 p-4 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={request.requester.profilePic}
                alt={request.requester.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="font-semibold text-white hover:text-blue-400 cursor-pointer">
                    {request.requester.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{request.requester.title}</p>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-300"
                  aria-label="More options"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-500 text-xs mb-4">
                {new Date(request.createdAt).toLocaleDateString()}
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleResponse(request.id, 'DECLINED')}
                  className="px-6 py-2 border border-gray-500 text-gray-300 rounded-full hover:bg-zinc-600 transition-colors"
                >
                  Ignore
                </button>
                <button
                  onClick={() => handleResponse(request.id, 'ACCEPTED')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
