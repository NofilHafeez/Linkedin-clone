'use client';

import {
  Camera, Edit, MessageCircle, X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { User } from '@/types/user';

export type MinimalUser = Pick<
  User,
  "id" | "name" | "title" | "location" | "profilePic" | "bannerPic"
>;

interface ProfileHeaderProps {
  searchUser: MinimalUser;
}


export default function ProfileHeader({ searchUser }: ProfileHeaderProps) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [imageTypeModal, setImageTypeModal] = useState<'profile' | 'banner' | null>(null);
  const [editedName, setEditedName] = useState(searchUser.name);
  const [editedTitle, setEditedTitle] = useState(searchUser.title);
  const [editedLocation, setEditedLocation] = useState(searchUser.location);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Trigger profile view logging
  useEffect(() => {
    if (user?.id === searchUser.id) return;
    const timeout = setTimeout(() => {
      axios.post('/api/viewProfile', {
        searchUserId: searchUser.id,
        viewedProfile: 1,
      }, { withCredentials: true }).catch(console.error);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [user?.id, searchUser.id]);

  const handleImageUpload = async (file: File, type: 'profile' | 'banner') => {
    if (!user?.id) return toast.error("User ID is required.");

    const formData = new FormData();
    formData.append('image', file);
    formData.append('userId', user.id);
    formData.append('type', type);

    try {
      const { data } = await axios.post('/api/edit-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      toast.success(`${type === 'profile' ? 'Profile' : 'Banner'} picture updated`);
      if (type === 'profile') user.profilePic = data.imageUrl;
      else user.bannerPic = data.imageUrl;
      setImageTypeModal(null);
    } catch (err) {
      toast.error("Failed to upload image");
    }
  };

  const handleTextEdit = async () => {
    if (!user?.id) return toast.error("User ID is required.");

   

    const formData = new FormData();
    formData.append('userId', user.id);
     if (editedName && editedTitle && editedLocation !== undefined) {
       formData.append('name', editedName);
       formData.append('title', editedTitle);
       formData.append('location', editedLocation);      
      }
      
    try {
      await axios.post('/api/edit-profile', formData, { withCredentials: true });
      toast.success("Profile updated");
      setShowEditModal(false);
    } catch (err) {
      toast.error("Failed to update profile details");
    }
  };

  const isOwnProfile = user?.id === searchUser.id;

  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden">
      {/* Banner */}
      <div className="h-48 bg-zinc-700 relative">
        <img
          src={searchUser.bannerPic || '/default-banner.jpg'}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        {isOwnProfile && (
          <button
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30"
            onClick={() => setImageTypeModal('banner')}
          >
            <Camera className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-6 pb-6">
        <div className="relative -mt-28 mb-4 px-4">
          <div className="w-40 h-40 rounded-full border-4 border-white bg-gray-300 overflow-hidden">
            <img
              src={searchUser.profilePic || '/default.jpg'}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {isOwnProfile && (
            <>
              <button
                className="absolute bottom-2 left-36 p-2 bg-white rounded-full shadow border"
                onClick={() => setImageTypeModal('profile')}
              >
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
              <button
                className="absolute bottom-2 right-6 p-1 text-gray-400 hover:text-gray-600"
                onClick={() => setShowEditModal(true)}
              >
                <Edit className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Name, Title, Location */}
        <div>
          <h1 className="text-2xl font-bold text-white">{editedName}</h1>
          <p className="text-md text-gray-300 mb-2">{editedTitle}</p>
          <div className="text-sm text-gray-400 mb-3">
            {editedLocation || "No location"}
          </div>

          {/* Follow/Message */}
          {!isOwnProfile && (
            <div className="flex items-center space-x-2 mt-4">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-6 py-1 rounded-full ${
                  isFollowing
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-blue-400 text-black hover:bg-blue-300'
                }`}
              >
                {isFollowing ? 'Connected' : 'Connect'}
              </button>
              <button className="px-6 py-1 border border-blue-400 text-blue-400 rounded-full hover:bg-blue-50">
                <MessageCircle className="w-4 h-4 inline mr-2" />
                Message
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <Modal title="Edit Profile" onClose={() => setShowEditModal(false)}>
          <div className="space-y-4">
            {[
              { label: "Name", value: editedName, setValue: setEditedName },
              { label: "Title", value: editedTitle, setValue: setEditedTitle },
              { label: "Location", value: editedLocation, setValue: setEditedLocation },
            ].map(({ label, value, setValue }) => (
              <div key={label}>
                <label className="block mb-1">{label}</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full border rounded px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-6 space-x-2">
            <button className="text-gray-300 hover:text-white" onClick={() => setShowEditModal(false)}>Cancel</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleTextEdit}>
              Save
            </button>
          </div>
        </Modal>
      )}

      {/* Image Upload Modal */}
      {imageTypeModal && (
        <Modal
          title={`Upload ${imageTypeModal === 'profile' ? 'Profile' : 'Banner'} Photo`}
          onClose={() => setImageTypeModal(null)}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full"
          />
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={!imageFile}
            onClick={() => imageFile && handleImageUpload(imageFile, imageTypeModal)}
          >
            Upload
          </button>
        </Modal>
      )}
    </div>
  );
}

// Reusable Modal Component
function Modal({
  children,
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-zinc-900 text-white rounded-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}
