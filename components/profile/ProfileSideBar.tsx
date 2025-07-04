'use client';

import { ExternalLink, Users, Eye, TrendingUp } from 'lucide-react';

export default function ProfileSidebar() {
  const profileLanguages = [
    { language: 'English', level: 'Native or bilingual proficiency' },
    { language: 'Spanish', level: 'Professional working proficiency' },
    { language: 'Mandarin', level: 'Elementary proficiency' }
  ];

  const publicProfileBadges = [
    'Top Product Management Voice',
    'LinkedIn Learning Instructor',
    'Open to Work'
  ];

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

      {/* Languages */}
      <div className="bg-zinc-900 rounded-lg p-4">
        <h3 className="font-semibold text-white mb-4">Languages</h3>
        <div className="space-y-3">
          {profileLanguages.map((lang, index) => (
            <div key={index}>
              <h4 className="font-medium text-white">{lang.language}</h4>
              <p className="text-sm text-gray-500">{lang.level}</p>
            </div>
          ))}
        </div>
      </div>

      {/* People Also Viewed */}
      <div className="bg-zinc-900 rounded-lg  p-4">
        <h3 className="font-semibold text--white mb-4">People also viewed</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={`https://images.pexels.com/photos/${1181686 + i}/pexels-photo-${1181686 + i}.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white text-sm hover:text-blue-500 cursor-pointer">
                  {i === 1 ? 'Emily Watson' : i === 2 ? 'James Miller' : 'Lisa Chen'}
                </h4>
                <p className="text-xs text-gray-500 truncate">
                  {i === 1 ? 'Product Manager at Microsoft' : i === 2 ? 'Senior Developer at Apple' : 'Design Lead at Figma'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* People You May Know */}
      <div className="bg-zinc-900 rounded-lg p-4">
        <h3 className="font-semibold text-white mb-4">People you may know</h3>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2">
                <img
                  src={`https://images.pexels.com/photos/${1222271 + i}/pexels-photo-${1222271 + i}.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-medium text-white text-sm hover:text-blue-600 cursor-pointer">
                {i === 1 ? 'David Kim' : 'Maria Rodriguez'}
              </h4>
              <p className="text-xs text-gray-500 mb-2">
                {i === 1 ? 'UX Designer at Design Studio' : 'Marketing Director at StartupXYZ'}
              </p>
              <button className="px-4 py-1 border border-blue-600 text-blue-600 rounded-full text-xs hover:bg-blue-50 transition-colors">
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Badges */}
      <div className="bg-zinc-900 rounded-lg p-4">
        <h3 className="font-semibold text-white mb-4">Profile badges</h3>
        <div className="space-y-2">
          {publicProfileBadges.map((badge, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-blue-800 font-medium">{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}