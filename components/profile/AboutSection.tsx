'use client';

import { Edit, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';


export default function AboutSection({ userBio, searchUserId }: { userBio?: string, searchUserId: string }) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(userBio || '');
  const [loading, setLoading] = useState(false);

const handleSave = async () => {
  if (!user?.id) return;

  if (editedBio.trim() === user.bio?.trim()) {
    toast('No changes made.');
    setIsEditing(false);
    return;
  }

  setLoading(true);

  try {
    const formData = new FormData();
    formData.append('userId', user.id);
    formData.append('bio', editedBio.trim());

    const res = await axios.post('/api/edit-profile', formData, {
      withCredentials: true,
    });

    if (res.status === 200) {
      setIsEditing(false);
      toast.success('About section updated');
    }
  } catch (err) {
    console.error(err);
    toast.error('Error updating bio. Please try again.');
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      {/* Main About Display */}
      <div className="bg-zinc-900 rounded-2xl p-6 shadow-md relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">About</h2>
         {user?.id === searchUserId && (
            <button className="px-4 py-2 text-white rounded">
              <Edit className="w-5 h-5 " onClick={() => setIsEditing(true)} />
            </button>
          )}
        </div>
        <p className="text-white text-sm leading-relaxed whitespace-pre-line">
          {userBio ? userBio : 'No bio available.'}
        </p>
      </div>

      {/* Modal Overlay for Editing */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-zinc-900 w-full max-w-xl mx-4 rounded-xl shadow-lg p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedBio(userBio || '');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-semibold text-white mb-4">Edit About</h3>

            <textarea
              value={editedBio}
              onChange={(e) => setEditedBio(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Write something about yourself..."
            />

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedBio(userBio || '');
                }}
                className="px-4 py-2 border border-zinc-600 text-white rounded hover:bg-zinc-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition"
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
