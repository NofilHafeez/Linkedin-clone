'use client';

import { Edit } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

export default function AboutSection({ bio }: { bio?: string }) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(bio || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user?.id) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('bio', editedBio);

      const res = await axios.post('/api/edit-profile', formData, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating bio:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">About</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Edit className="w-5 h-5" />
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="text-white text-sm leading-relaxed">
          <p className="mb-4">{bio ? bio : 'No bio available.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            value={editedBio}
            onChange={(e) => setEditedBio(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write something about yourself..."
          />

          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedBio(bio || '');
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
