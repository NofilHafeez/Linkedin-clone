'use client';

import { Edit, Plus, Building, Calendar } from 'lucide-react';

export default function ExperienceSection() {
  const experiences = [
    {
      id: 1,
      title: 'Senior Product Manager',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      duration: 'Jan 2022 - Present',
      totalTime: '2 years 3 months',
      type: 'Full-time',
      logo: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      description: [
        'Led product strategy and roadmap for core platform serving 2M+ users',
        'Increased user engagement by 40% through data-driven feature optimization',
        'Managed cross-functional team of 12 engineers, designers, and analysts',
        'Launched 3 major features that contributed $2M in additional revenue',
        'Implemented agile processes that reduced development cycle time by 30%'
      ]
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'StartupXYZ',
      location: 'San Francisco, CA',
      duration: 'Mar 2020 - Dec 2021',
      totalTime: '1 year 10 months',
      type: 'Full-time',
      logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      description: [
        'Built product from 0 to 1, achieving product-market fit within 18 months',
        'Conducted 100+ user interviews to validate product hypotheses',
        'Collaborated with engineering team to deliver MVP in 6 months',
        'Grew user base from 0 to 50K active users',
        'Secured Series A funding through compelling product demos and metrics'
      ]
    },
    {
      id: 3,
      title: 'Associate Product Manager',
      company: 'BigTech Inc.',
      location: 'Mountain View, CA',
      duration: 'Jun 2018 - Feb 2020',
      totalTime: '1 year 9 months',
      type: 'Full-time',
      logo: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      description: [
        'Supported senior PM in managing enterprise software product line',
        'Analyzed user behavior data to identify optimization opportunities',
        'Coordinated with UX team to improve user onboarding flow',
        'Reduced customer churn by 15% through targeted feature improvements',
        'Presented quarterly business reviews to executive leadership'
      ]
    }
  ];

  return (
    <div className="bg-zinc-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Experience</h2>
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
        {experiences.map((exp, index) => (
          <div key={exp.id} className={`${index !== experiences.length - 1 ? 'border-b pb-6' : ''}`}>
            <div className="flex space-x-4">
              <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                <img
                  src={exp.logo}
                  alt={exp.company}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{exp.title}</h3>
                    <p className="text-gray-300 font-medium">{exp.company} · {exp.type}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>{exp.duration} · {exp.totalTime}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Building className="w-4 h-4" />
                      <span>{exp.location}</span>
                    </div>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mt-3">
                  <ul className="space-y-2">
                    {exp.description.map((item, idx) => (
                      <li key={idx} className="text-white text-sm flex items-start">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}