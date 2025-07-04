'use client';

import { Edit, Plus, Quote } from 'lucide-react';

export default function RecommendationsSection() {
  const recommendations = [
    {
      id: 1,
      recommender: {
        name: 'Michael Chen',
        title: 'Engineering Manager at TechCorp',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        relationship: 'Michael worked with Sarah on the same team'
      },
      text: 'Sarah is an exceptional product manager who consistently delivers outstanding results. Her ability to translate complex technical requirements into clear, actionable roadmaps is remarkable. She led our team through a challenging product launch that exceeded all expectations, increasing user engagement by 40%. Sarah\'s collaborative approach and strategic thinking make her an invaluable team member.',
      date: 'February 15, 2024'
    },
    {
      id: 2,
      recommender: {
        name: 'Lisa Rodriguez',
        title: 'Senior UX Designer at TechCorp',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        relationship: 'Lisa worked with Sarah on the same team'
      },
      text: 'Working with Sarah has been one of the highlights of my career. She has an incredible talent for understanding user needs and translating them into product features that truly make a difference. Her data-driven approach combined with genuine empathy for users creates products that people love to use. I would jump at the chance to work with her again.',
      date: 'January 8, 2024'
    }
  ];

  return (
    <div className="bg-zinc-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Recommendations</h2>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors text-sm">
            Ask for recommendation
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Edit className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {recommendations.map((rec, index) => (
          <div key={rec.id} className={`${index !== recommendations.length - 1 ? 'border-b pb-6' : ''}`}>
            <div className="flex space-x-4">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={rec.recommender.avatar}
                  alt={rec.recommender.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <div className="mb-3">
                  <h3 className="font-semibold text-white hover:text-blue-600 cursor-pointer">
                    {rec.recommender.name}
                  </h3>
                  <p className="text-sm text-gray-300">{rec.recommender.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{rec.recommender.relationship}</p>
                </div>
                
                <div className="relative">
                  <Quote className="absolute -top-1 -left-4 w-6 h-6 text-white" />
                  <blockquote className="text-white text-sm leading-relaxed pl-4 italic">
                    "{rec.text}"
                  </blockquote>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{rec.date}</span>
                  <button className="text-sm text-blue-600 hover:underline">
                    Show more
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t">
        <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-600 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Ask for recommendation</span>
        </button>
      </div>
    </div>
  );
}