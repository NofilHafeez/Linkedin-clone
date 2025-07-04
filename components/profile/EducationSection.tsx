'use client';

import { Edit, Plus, GraduationCap, Calendar } from 'lucide-react';

export default function EducationSection() {
  const education = [
    {
      id: 1,
      school: 'Stanford University',
      degree: 'Master of Business Administration (MBA)',
      field: 'Technology Management',
      duration: '2016 - 2018',
      logo: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      description: 'Focused on technology strategy, product management, and entrepreneurship. Completed capstone project on AI-driven product recommendations.',
      activities: ['Product Management Club', 'Tech Entrepreneurship Society', 'Case Competition Winner']
    },
    {
      id: 2,
      school: 'University of California, Berkeley',
      degree: 'Bachelor of Science (BS)',
      field: 'Computer Science',
      duration: '2012 - 2016',
      logo: 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      description: 'Graduated Magna Cum Laude with a focus on software engineering and human-computer interaction.',
      activities: ['ACM Student Chapter', 'Women in Tech', 'Hackathon Organizer']
    }
  ];

  return (
    <div className="bg-zinc-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Education</h2>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Edit className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {education.map((edu, index) => (
          <div key={edu.id} className={`${index !== education.length - 1 ? 'border-b pb-6' : ''}`}>
            <div className="flex space-x-4">
              <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                <img
                  src={edu.logo}
                  alt={edu.school}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{edu.school}</h3>
                    <p className="text-gray-300 font-medium">{edu.degree}</p>
                    <p className="text-gray-500">{edu.field}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>{edu.duration}</span>
                    </div>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mt-3 space-y-3">
                  <p className="text-gray-500 text-sm">{edu.description}</p>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Activities and societies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {edu.activities.map((activity, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}