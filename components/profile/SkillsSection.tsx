'use client';

import { Edit, Plus, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import axios from 'axios';

interface Skill {
  name: string;
  endorsements: number;
  endorsed: boolean;
}

export default function SkillsSection({ skills = [] }: { skills?: Skill[] }) {
  const { user } = useAuth();
  const [skillsList, setSkillsList] = useState<Skill[]>(skills);
  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEndorse = async (skillName: string) => {
    if (!user?.id) return;

    try {
      const res = await axios.post('/api/edit-profile', {
        userId: user.id,
        skillName,
      }, { withCredentials: true });

      if (res.status === 200) {
        setSkillsList(prev =>
          prev.map(skill =>
            skill.name === skillName
              ? {
                  ...skill,
                  endorsed: !skill.endorsed,
                  endorsements: skill.endorsed
                    ? skill.endorsements - 1
                    : skill.endorsements + 1,
                }
              : skill
          )
        );
      }
    } catch (error) {
      console.error('Error endorsing skill:', error);
    }
  };

  const handleAddSkill = async () => {
    if (!user?.id || !newSkill.trim()) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('skill', newSkill);

      const res = await axios.post('/api/edit-profile', formData, {
        withCredentials: true,
      });

      if (res.status === 200) {
        const addedSkill: Skill = {
          name: newSkill,
          endorsements: 0,
          endorsed: false,
        };

        setSkillsList(prev => [...prev, addedSkill]);
        setNewSkill('');
        setIsAdding(false);
      }
    } catch (error) {
      console.error('Error adding skill:', error);
    } finally {
      setLoading(false);
    }
  };

  const topSkills = skillsList.slice(0, 3);
  const otherSkills = skillsList.slice(3);

  return (
    <>
      <div className="bg-zinc-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Skills</h2>
          <button
            onClick={() => setIsAdding(true)}
            className="p-2 text-gray-400 hover:text-white transition"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Top Skills */}
        <div className="space-y-4 mb-6">
          {topSkills.map((skill) => (
            <div key={skill.name} className="border-b pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{skill.name}</h3>
                  <p className="text-sm text-gray-300 mt-1">
                    Endorsed by {skill.endorsements} colleagues
                  </p>
                </div>
                <button
                  onClick={() => handleEndorse(skill.name)}
                  className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                    skill.endorsed
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {skill.endorsed ? 'Endorsed' : 'Endorse'}
                </button>
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
                className="flex items-center justify-between p-3 border border-zinc-800 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                <div>
                  <h4 className="font-medium text-white">{skill.name}</h4>
                  <p className="text-xs text-gray-400">{skill.endorsements} endorsements</p>
                </div>
                <button
                  onClick={() => handleEndorse(skill.name)}
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

      {/* Add Skill Modal */}
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
