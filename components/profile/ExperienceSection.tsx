'use client';

import { Edit, Plus, Building, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import axios from 'axios';

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  totalTime: string;
  type: string;
  logo: string;
  description: string[];
}

export default function ExperienceSection({ experience = [] }: { experience?: Experience[] }) {
  const { user } = useAuth();
  const [experienceList, setExperienceList] = useState<Experience[]>(experience);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [totalTime, setTotalTime] = useState('');
  const [type, setType] = useState('');
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');

  const handleAddExperience = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('experience', JSON.stringify({
        title,
        company,
        location,
        duration,
        totalTime,
        type,
        logo,
        description: description.split('\n').filter(line => line.trim() !== ''),
      }));

      const res = await axios.post('/api/edit-profile', formData, {
        withCredentials: true,
      });

      if (res.status === 200) {
        const newExp: Experience = {
          id: Date.now().toString(),
          title,
          company,
          location,
          duration,
          totalTime,
          type,
          logo,
          description: description.split('\n').filter(line => line.trim() !== ''),
        };

        setExperienceList(prev => [...prev, newExp]);
        resetForm();
        setIsAdding(false);
      }
    } catch (error) {
      console.error('Error adding experience:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setCompany('');
    setLocation('');
    setDuration('');
    setTotalTime('');
    setType('');
    setLogo('');
    setDescription('');
  };

  return (
    <div className="bg-zinc-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Experience</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {experienceList.length === 0 && (
        <p className="text-gray-400 text-sm">No experience added yet.</p>
      )}

      <div className="space-y-6">
        {experienceList.map((exp, index) => (
          <div key={exp.id} className={`${index !== experienceList.length - 1 ? 'border-b pb-6' : ''}`}>
            <div className="flex space-x-4">
              <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                <img
                  src={exp.logo || 'https://via.placeholder.com/50'}
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

      {isAdding && (
        <div className="mt-6 space-y-4 border-t pt-4">
          <h3 className="text-lg font-semibold text-white">Add Experience</h3>

          <input
            type="text"
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 text-white rounded focus:outline-none"
          />

          <input
            type="text"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 text-white rounded focus:outline-none"
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 text-white rounded focus:outline-none"
          />

          <input
            type="text"
            placeholder="Duration (e.g., Jan 2022 - Present)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 text-white rounded focus:outline-none"
          />

          <input
            type="text"
            placeholder="Total Time (e.g., 2 years 3 months)"
            value={totalTime}
            onChange={(e) => setTotalTime(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 text-white rounded focus:outline-none"
          />

          <input
            type="text"
            placeholder="Employment Type (e.g., Full-time)"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 text-white rounded focus:outline-none"
          />

          <input
            type="text"
            placeholder="Logo URL"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 text-white rounded focus:outline-none"
          />

          <textarea
            placeholder="Description (one point per line)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-zinc-800 text-white rounded focus:outline-none"
          />

          <div className="flex space-x-2">
            <button
              onClick={handleAddExperience}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                resetForm();
              }}
              className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
