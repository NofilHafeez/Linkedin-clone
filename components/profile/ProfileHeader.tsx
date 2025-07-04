'use client';

import { Camera, Edit, Plus, MessageCircle, MoreHorizontal, MapPin, Building, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  title: string;
  location: string;
  company: string;
  connections: number;
  profilePic: string;
  bannerPic: string;
  coverImage: string;
  companyImage: string;
  companyDuration: string;
}

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProfileImageModal, setShowProfileImageModal] = useState(false);
  const [showBannerImageModal, setShowBannerImageModal] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedTitle, setEditedTitle] = useState(user.title);
  const [editedLocation, setEditedLocation] = useState(user.location);
  const [imageFile, setImageFile] = useState<File | null>(null);
  

const handleEditProfile = async (file: File, type: 'profile' | 'banner') => {
  if (!user?.id) {
    alert("User ID is required.");
    return;
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('userId', user.id);
  formData.append('type', type);
  formData.append('name', editedName);
  formData.append('title', editedTitle);
  formData.append('location', editedLocation);

  try {
    const response = await axios.post('/api/edit-profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    });

    const updatedImageUrl = response.data.imageUrl;

    // Instantly update local state
    if (type === 'profile') {
      user.profilePic = updatedImageUrl;
    } else if (type === 'banner') {
      user.bannerPic = updatedImageUrl;
    }

    setShowProfileImageModal(false);
    setShowBannerImageModal(false);
  } catch (error) {
    console.error('Error updating profile:', error);
  }
};




  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden relative">
      {/* Cover Photo */}
      <div className="h-48 bg-zinc-700 relative">
        <img
          src={user.bannerPic || 'https://via.placeholder.com/800x200'}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <button
          className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
          onClick={() => setShowBannerImageModal(true)}
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Info */}
      <div className="px-6 pb-6">
        {/* Profile Picture */}
        <div className="relative -mt-20 mb-4">
          <div className="w-40 h-40 rounded-full border-4 border-white bg-gray-300 overflow-hidden">
            <img
              src={user.profilePic || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg border hover:bg-gray-50 transition-colors"
            onClick={() => setShowProfileImageModal(true)}
          >
            <Camera className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Name and Title */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h1 className="text-3xl font-bold text-white">{editedName}</h1>
              <button
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowEditModal(true)}
              >
                <Edit className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xl text-gray-300 mb-2">{editedTitle}</p>
            <div className="flex items-center space-x-4 text-gray-500 mb-3">
              <div className="flex items-center text-sm space-x-1">
                <MapPin className="w-5 h-5 mr-3" />
                <span>{editedLocation}</span>
              </div>
              <div className="flex items-center text-sm space-x-1">
                <Building className="w-4 h-4" />
                <span>TechCorp</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="text-blue-600 hover:underline cursor-pointer">{user.connections}</span>
              <span>Contact info</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              Open to
            </button>
            <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors">
              Add profile section
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">
              More
            </button>
          </div>
        </div>

        {/* Current Role Highlight */}
        <div className="bg-zinc-700 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded overflow-hidden flex-shrink-0">
              <img
                src={user.companyImage || 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'}
                alt="Company"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-white">{user.company}</h3>
              <p className="text-sm text-gray-300">{user.companyDuration}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`px-6 py-2 rounded-full transition-colors ${
              isFollowing
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
          <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors">
            <MessageCircle className="w-4 h-4 inline mr-2" />
            Message
          </button>
          <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 text-white rounded-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setShowEditModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full border rounded px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1">Title</label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full border rounded px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1">Location</label>
                <input
                  type="text"
                  value={editedLocation}
                  onChange={(e) => setEditedLocation(e.target.value)}
                  className="w-full border rounded px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                className="px-4 py-2 text-gray-300 hover:text-white"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleEditProfile}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Image Upload Modal */}
      {showProfileImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 text-white rounded-lg p-6 w-full max-w-sm relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setShowProfileImageModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">Upload Profile Photo</h2>
            <input type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImageFile(file);
              }}
             className="w-full" />
            <button
  className="px-4 py-2 mt-4 bg-blue-600 text-white rounded hover:bg-blue-700"
  onClick={() => {
    if (imageFile) {
      handleEditProfile(imageFile, 'profile');
    } else {
      alert("Please select an image first.");
    }
  }}
>
  Upload
</button>

          </div>
        </div>
      )}

      {/* Banner Image Upload Modal */}
      {showBannerImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 text-white rounded-lg p-6 w-full max-w-sm relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setShowBannerImageModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">Upload Banner Photo</h2>
             <input type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImageFile(file);
              }}
             className="w-full" />
            <button
  className="px-4 py-2 mt-4 bg-blue-600 text-white rounded hover:bg-blue-700"
  onClick={() => {
    if (imageFile) {
      handleEditProfile(imageFile, 'banner');
    } else {
      alert("Please select an image first.");
    }
  }}
>
  Upload
</button>

          </div>
        </div>
      )}
    </div>
  );
}
