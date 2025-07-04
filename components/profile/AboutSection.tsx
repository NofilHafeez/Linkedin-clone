'use client';

import { Edit } from 'lucide-react';

export default function AboutSection({ bio }: { bio?: string }) {
  return (
    <div className="bg-zinc-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">About</h2>
        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <Edit className="w-5 h-5" />
        </button>
      </div>
      
      <div className="text-white text-sm leading-relaxed">
          <p className="mb-4">
            {bio ? bio : "No bio available."}
          </p>
      </div>

    </div>
  );
}