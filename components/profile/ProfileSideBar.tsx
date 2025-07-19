'use client';
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Plus, X } from 'lucide-react';
import SidebarSkeleton from "../skeleton/SidebarSkeleton";


interface Person {
  id: string;
  name: string;
  title: string;
  profilePic: string;
}


export default function ProfileSidebar() {
  
    const [people, setPeople] = useState<Person[]>([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      if (!user?.id) return;
  
      const fetchPeople = async () => {
        try {
          const response = await axios.get(`/api/connections/?userId=${user.id}`, {
            withCredentials: true,
          });
  
          if (response.data) {
            console.log('Fetched people you may know:', response.data);
            setPeople(response.data.similarUsers || []);
          } else {
            console.error('No data received from API');
          }
        } catch (error) {
          console.error('Error fetching people you may know:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchPeople();
    }, [user?.id]);
  
    const sendConnectionRequest = async (receiverId: string) => {
      if (!user?.id) {
        console.error('User ID is missing.');
        return;
      }
  
      try {
        const response = await axios.post(
          '/api/connections/request',
          {
            requesterId: user.id,
            receiverId: receiverId,
          },
          { withCredentials: true }
        );
  
        if (response.status === 200) {
          setPeople((prev) => prev.filter((person) => person.id !== receiverId));
          console.log('Connection request sent successfully');
        }
      } catch (error) {
        console.error('Error sending connection request:', error);
      }
    };

    if (loading) {
      return (
        <div>
          <SidebarSkeleton/>
        </div>

      )
    }


  return (
    <div className="space-y-6">
      {/* Public Profile & URL */}
      <div className="bg-zinc-900 rounded-lg p-4">
        <h3 className="font-semibold text-white mb-4">Public profile & URL</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Your profile was viewed by</span>
            <span className="font-semibold text-blue-600">127 people</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Appeared in search</span>
            <span className="font-semibold text-blue-600">89 times</span>
          </div>
          <button className="w-full mt-3 py-2 text-blue-600 hover:bg-blue-50 transition-colors rounded-lg text-sm font-medium">
            View public profile
          </button>
        </div>
      </div>


       {/* People You May Know */}
      <div className="bg-zinc-900 rounded-lg shadow-sm p-6">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-lg font-semibold text-white">People you may know</h2>
  </div>

  {people.length === 0 ? (
    <p className="text-gray-400 text-center">No people to suggest right now.</p>
  ) : (
    <div className="flex flex-col gap-4">
      {people.map((person) => (
        <div
          key={person.id}
          className="rounded-lg p-4 hover:bg-zinc-700 transition-colors border border-zinc-700"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img
                src={person.profilePic || '/default.jpg'}
                alt={`${person.name}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              className="text-gray-400 hover:text-gray-200"
              aria-label="Dismiss suggestion"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-white hover:text-blue-400 cursor-pointer text-sm">
              {person.name}
            </h3>
            <p className="text-gray-400 text-xs mt-1">{person.title || 'No title available'}</p>
          </div>

          <button
            onClick={() => sendConnectionRequest(person.id)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-blue-600 text-blue-400 rounded-full hover:bg-blue-600 hover:text-white transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Connect</span>
          </button>
        </div>
      ))}
    </div>
  )}
</div>
    </div>
  );
}