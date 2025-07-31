'use client';

import { Plus, Calendar, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface EducationEntry {
  school: string;
  degree: string;
  field: string;
  duration: string;
  description: string;
  activities: string[];
  logo: string;
}

interface EduProp {
  userEducation: EducationEntry[];
  searchUserId: string;
}

const defaultForm = {
  school: '',
  degree: '',
  field: '',
  duration: '',
  description: '',
  activities: '',
  logo: '',
};

export default function EducationSection({ userEducation, searchUserId }: EduProp) {
  const { user } = useAuth();
  const [educationList, setEducationList] = useState<EducationEntry[]>(userEducation);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ ...defaultForm });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => setForm({ ...defaultForm });

  const handleAddEducation = async () => {
    if (!user?.id) return;

    const { school, degree, field, duration, description, activities, logo } = form;

    if (!school || !degree || !field || !duration) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const activityList = activities
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a);

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append(
        'education',
        JSON.stringify({
          school,
          degree,
          field,
          duration,
          description,
          activities: activityList,
          logo,
        })
      );

      const res = await axios.post('/api/edit-profile', formData, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setEducationList((prev) => [
          ...prev,
          { school, degree, field, duration, description, activities: activityList, logo },
        ]);
        toast.success('Education added successfully!');
        setIsAdding(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error adding education:', error);
      toast.error('Failed to add education.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Education List */}
      <div className="bg-zinc-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Education</h2>
        {user?.id === searchUserId && (
            <button
            onClick={() => setIsAdding(true)}
            className="p-2 text-gray-400 hover:text-white transition"
            aria-label="Add education"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}  
        </div>

        {educationList.length === 0 ? (
          <p className="text-gray-400 text-sm">No education added yet.</p>
        ) : (
          <div className="space-y-6">
            {educationList.map((edu, index) => (
              <div key={index} className={index !== educationList.length - 1 ? 'border-b pb-6' : ''}>
                <div className="flex space-x-4">
                  <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={edu.logo || 'https://via.placeholder.com/50'}
                      alt={`${edu.school} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{edu.school}</h3>
                    <p className="text-gray-300 font-medium">{edu.degree}</p>
                    <p className="text-gray-500">{edu.field}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>{edu.duration}</span>
                    </div>
                    {edu.description && (
                      <p className="mt-2 text-gray-400 text-sm">{edu.description}</p>
                    )}
                    {edu.activities.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium text-gray-400 mb-1">
                          Activities and societies:
                        </h4>
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
            ))}
          </div>
        )}
      </div>

      {/* Modal for Adding Education */}
      {isAdding && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-zinc-900 w-full max-w-xl rounded-xl shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => {
                setIsAdding(false);
                resetForm();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-semibold text-white mb-6">Add Education</h3>

            <div className="space-y-4">
              {[
                { label: 'School', name: 'school' },
                { label: 'Degree', name: 'degree' },
                { label: 'Field of Study', name: 'field' },
                { label: 'Duration (e.g., 2020 - 2024)', name: 'duration' },
                { label: 'Activities (comma separated)', name: 'activities' },
                { label: 'Logo URL', name: 'logo' },
              ].map(({ label, name }) => (
                <input
                  key={name}
                  type="text"
                  name={name}
                  placeholder={label}
                  value={(form as any)[name]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-zinc-800 text-white rounded focus:outline-none"
                />
              ))}

              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-zinc-800 text-white rounded focus:outline-none"
              />

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => {
                    setIsAdding(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-zinc-600 text-white rounded hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEducation}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
