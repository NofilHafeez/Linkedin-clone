'use client';

import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface Person {
  id: string;
  name: string;
  title: string;
  profilePic: string;
}


export default function RightSidebar() {
  const [dismissedNews, setDismissedNews] = useState<number[]>([]);
  const [dismissedConnections, setDismissedConnections] = useState<number[]>([]);

  const newsItems = [
    { id: 1, title: 'Tech industry sees major growth', readers: '1,234 readers' },
    { id: 2, title: 'Remote work trends in 2024', readers: '2,567 readers' },
    { id: 3, title: 'AI revolution in workplace', readers: '3,421 readers' },
    { id: 4, title: 'Startup funding reaches new highs', readers: '891 readers' },
    { id: 5, title: 'Green technology investments surge', readers: '1,567 readers' },
  ];

  const suggestedConnections = [
    {
      id: 1,
      name: 'Emily Watson',
      title: 'Product Manager at Microsoft',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      mutualConnections: 12
    },
    {
      id: 2,
      name: 'James Miller',
      title: 'Senior Developer at Apple',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      mutualConnections: 8
    },
    {
      id: 3,
      name: 'Lisa Chen',
      title: 'Design Lead at Figma',
      avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      mutualConnections: 15
    }
  ];

  const [people, setPeople] = useState<Person[]>([]);
  const { user } = useAuth();

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

  const dismissNews = (id: number) => {
    setDismissedNews([...dismissedNews, id]);
  };

  const dismissConnection = (id: number) => {
    setDismissedConnections([...dismissedConnections, id]);
  };

  const visibleNews = newsItems.filter(item => !dismissedNews.includes(item.id));
  const visibleConnections = suggestedConnections.filter(item => !dismissedConnections.includes(item.id));

  return (
    <div className="space-y-4">
      {/* LinkedIn News */}
      <div className="bg-zinc-900 rounded-lg  overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-white">LinkedIn News</h3>
          <p className="text-xs text-gray-500 mt-1">Top stories</p>
        </div>
        
        <div className="p-4 space-y-4">
          {visibleNews.slice(0, 5).map((item) => (
            <div key={item.id} className="group">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white group-hover:text-blue-600 cursor-pointer transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">{item.readers}</p>
                </div>
                <button
                  onClick={() => dismissNews(item.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
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

      
      {/* Footer Links */}
      <div className="rounded-lg  p-4">
        <div className="text-xs text-gray-500 space-y-2">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <a href="/" className="hover:text-blue-600 transition-colors">About</a>
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
          <div className="pt-2">
            <span className="text-white">LinkedIn Corporation © 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
}