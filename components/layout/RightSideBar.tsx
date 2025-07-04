'use client';

import { Plus, X } from 'lucide-react';
import { useState } from 'react';

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
      <div className="bg-zinc-900 rounded-lg  overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-white">People you may know</h3>
        </div>
        
        <div className="p-4 space-y-4">
          {visibleConnections.map((person) => (
            <div key={person.id} className="group">
              <div className="flex items-start justify-between">
                <div className="flex space-x-3 flex-1">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white hover:text-blue-600 cursor-pointer transition-colors">
                      {person.name}
                    </h4>
                    <p className="text-xs text-gray-300 mt-1">{person.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {person.mutualConnections} mutual connections
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => dismissConnection(person.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mt-3 flex space-x-2">
                <button className="flex items-center space-x-1 px-3 py-1.5 border border-blue-600 text-blue-600 rounded-full text-xs hover:bg-blue-50 transition-colors">
                  <Plus className="w-3 h-3" />
                  <span>Connect</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer Links */}
      <div className="bg-zinc-900 rounded-lg  p-4">
        <div className="text-xs text-gray-500 space-y-2">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <a href="#" className="hover:text-blue-600 transition-colors">About</a>
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
          <div className="pt-2 border-t">
            <span className="text-white">LinkedIn Corporation © 2024</span>
          </div>
        </div>
      </div>
    </div>
  );
}