'use client';

import { Edit, Plus, ChevronRight } from 'lucide-react';

export default function SkillsSection() {
  const skills = [
    { name: 'Product Management', endorsements: 47, endorsed: true },
    { name: 'Agile Methodologies', endorsements: 32, endorsed: false },
    { name: 'User Experience (UX)', endorsements: 28, endorsed: true },
    { name: 'Data Analysis', endorsements: 24, endorsed: false },
    { name: 'Strategic Planning', endorsements: 19, endorsed: true },
    { name: 'Cross-functional Team Leadership', endorsements: 16, endorsed: false },
    { name: 'A/B Testing', endorsements: 14, endorsed: true },
    { name: 'Roadmap Planning', endorsements: 12, endorsed: false },
    { name: 'Stakeholder Management', endorsements: 11, endorsed: true }
  ];

  const topSkills = skills.slice(0, 3);
  const otherSkills = skills.slice(3);

  return (
    <div className="bg-zinc-900 rounded-lg  p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Skills</h2>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Edit className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Top Skills */}
      <div className="space-y-4 mb-6">
        {topSkills.map((skill, index) => (
          <div key={skill.name} className="border-b pb-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-wihte">{skill.name}</h3>
                <p className="text-sm text-gray-300 mt-1">
                  Endorsed by {skill.endorsements} colleagues
                </p>
              </div>
              <button
                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                  skill.endorsed
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}
              >
                {skill.endorsed ? 'Endorsed' : 'Endorse'}
              </button>
            </div>
            
            {/* Endorser avatars */}
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 overflow-hidden"
                  >
                    <img
                      src={`https://images.pexels.com/photos/${1043471 + i}/pexels-photo-${1043471 + i}.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`}
                      alt="Endorser"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                and {skill.endorsements - 4} others
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Other Skills */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {otherSkills.map((skill) => (
            <div
              key={skill.name}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div>
                <h4 className="font-medium text-white">{skill.name}</h4>
                <p className="text-xs text-gray-600">{skill.endorsements} endorsements</p>
              </div>
              <button
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  skill.endorsed
                    ? 'bg-blue-100 text-blue-700'
                    : 'border border-gray-300 text-gray-600 hover:border-blue-600 hover:text-blue-600'
                }`}
              >
                {skill.endorsed ? '✓' : '+'}
              </button>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-4 py-2 text-gray-600 hover:text-blue-600 transition-colors flex items-center justify-center space-x-1">
          <span>Show all skills</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}