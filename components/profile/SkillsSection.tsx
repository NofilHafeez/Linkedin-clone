'use client';

import { Plus, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import axios from 'axios';

export default function SkillsSection({ userSkills = [], searchUserId }: { userSkills?: string[], searchUserId: string }) {
  const { user } = useAuth();
  const [skillsList, setSkillsList] = useState<string[]>(userSkills);
  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);

  const handleAddSkill = async () => {
    if (!user?.id || !newSkill.trim()) return;
    setLoading(true);

    try {
      const updatedSkills = [...skillsList, newSkill.trim()];
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('skills', JSON.stringify(updatedSkills));

      const res = await axios.post('/api/edit-profile', formData, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setSkillsList(updatedSkills);
        setNewSkill('');
        setIsAdding(false);
      }
    } catch (error) {
      console.error('Error adding skill:', error);
    } finally {
      setLoading(false);
    }
  };

  const visibleSkills = showAllSkills ? skillsList : skillsList.slice(0, 3);

  return (
    <>
      <div className="bg-zinc-900 rounded-lg p-6 transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Skills</h2>
        { user?.id === searchUserId && (
          <button
            onClick={() => setIsAdding(true)}
            className="p-2 text-gray-400 hover:text-white transition"
            aria-label="Add skill"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {visibleSkills.map((skill, idx) => (
            <div
              key={idx}
              className="p-3 border border-zinc-800 bg-zinc-800 rounded-lg text-white"
            >
              {skill}
            </div>
          ))}
        </div>

        {skillsList.length > 3 && (
          <button
            onClick={() => setShowAllSkills(!showAllSkills)}
            className="w-full mt-4 py-2 text-gray-400 hover:text-blue-500 transition-colors flex items-center justify-center space-x-1"
          >
            <span>{showAllSkills ? 'Show less skills' : 'Show all skills'}</span>
            <ChevronRight
              className={`w-4 h-4 transition-transform ${
                showAllSkills ? 'rotate-90' : ''
              }`}
            />
          </button>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 w-full max-w-md mx-4 p-6 rounded-xl relative">
            <button
              onClick={() => {
                setIsAdding(false);
                setNewSkill('');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-semibold text-white mb-4">Add a New Skill</h3>

            <input
              type="text"
              placeholder="e.g. React, Node.js"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 text-white rounded focus:outline-none"
            />

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewSkill('');
                }}
                className="px-4 py-2 border border-zinc-600 text-white rounded hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSkill}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
