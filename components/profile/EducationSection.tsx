'use client';

import { Edit, Plus, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import axios from 'axios';

interface EducationEntry {
  id: string;
  school: string;
  degree: string;
  field: string;
  duration: string;
  description: string;
  activities: string[];
  logo: string;
}

export default function EducationSection({ education = [] }: { education?: EducationEntry[] }) {
  const { user } = useAuth();
  const [educationList, setEducationList] = useState<EducationEntry[]>(education);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state for new education
  const [school, setSchool] = useState('');
  const [degree, setDegree] = useState('');
  const [field, setField] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [activities, setActivities] = useState('');
  const [logo, setLogo] = useState('');

  const handleAddEducation = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('education', JSON.stringify({
        school,
        degree,
        field,
        duration,
        description,
        activities: activities.split(',').map(a => a.trim()),
        logo,
      }));

      const res = await axios.post('/api/edit-profile', formData, {
        withCredentials: true,
      });

      if (res.status === 200) {
        const newEducation: EducationEntry = {
          id: Date.now().toString(),
          school,
          degree,
          field,
          duration,
          description,
          activities: activities.split(',').map(a => a.trim()),
          logo,
        };

        setEducationList(prev => [...prev, newEducation]);
        setIsAdding(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error adding education:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSchool('');
    setDegree('');
    setField('');
    setDuration('');
    setDescription('');
    setActivities('');
    setLogo('');
  };

  return (
    <div className="bg-zinc-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Education</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {educationList.length === 0 && (
        <p className="text-gray-400 text-sm">No education added yet.</p>
      )}

      <div className="space-y-6">
        {educationList.map((edu, index) => (
          <div key={edu.id} className={`${index !== educationList.length - 1 ? 'border-b pb-6' : ''}`}>
            <div className="flex space-x-4">
              <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                <img
                  src={edu.logo || 'https://via.placeholder.com/50'}
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
                </div>

                <div className="mt-3 space-y-3">
                  <p className="text-gray-500 text-sm">{edu.description}</p>

                  {edu.activities.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Activities and societies:</h4>
                      <div className="flex flex-wrap gap-2">
                        {edu.activities.map((activity, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full"
                          >
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Education Form */}
      {isAdding && (
        <div className="mt-6 space-y-4 border-t pt-4">
          <h3 className="text-lg font-semibold text-white">Add Education</h3>

          <input
            type="text"
            placeholder="School"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 text-white rounded focus:outline-none"
          />

          <input
            type="text"
            placeholder="Degree"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 text-white rounded focus:outline-none"
          />

          <input
            type="text"
            placeholder="Field of Study"
            value={field}
            onChange={(e) => setField(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 text-white rounded focus:outline-none"
          />

          <input
            type="text"
            placeholder="Duration (e.g., 2020 - 2024)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 text-white rounded focus:outline-none"
          />

          <input
            type="text"
            placeholder="Activities (comma separated)"
            value={activities}
            onChange={(e) => setActivities(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 text-white rounded focus:outline-none"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-zinc-800 text-white rounded focus:outline-none"
          />

          <input
            type="text"
            placeholder="Logo URL"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 text-white rounded focus:outline-none"
          />

          <div className="flex space-x-2">
            <button
              onClick={handleAddEducation}
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
