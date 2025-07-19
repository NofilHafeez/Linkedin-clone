'use client';

import { Camera, Edit, Plus, MessageCircle, MoreHorizontal, MapPin, Building, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

interface User {
  id: string;
  name: string;
  title: string;
  location: string;
  profilePic?: string;
  bannerPic?: string;
}


interface ProfileHeaderProps {
  searchUser: User;
}

export default function ProfileHeader({ searchUser }: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProfileImageModal, setShowProfileImageModal] = useState(false);
  const [showBannerImageModal, setShowBannerImageModal] = useState(false);
  const [editedName, setEditedName] = useState(searchUser.name);
  const [editedTitle, setEditedTitle] = useState(searchUser.title);
  const [editedLocation, setEditedLocation] = useState(searchUser.location);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const {user} = useAuth();

  let userId  = user?.id;
  
useEffect(() => {
  const timeout = setTimeout(() => {
    if (user.id === searchUser.id) return;

    const profileView = async () => {
      try {
        await axios.post(
          "/api/viewProfile",
          { searchUserId: searchUser.id, viewedProfile: 1 },
          { withCredentials: true }
        );
      } catch (error) {
        console.log(error);
      }
    };

    profileView();
  }, 3000);

  // ✅ Cleanup on unmount or re-run
  return () => clearTimeout(timeout);
}, [user.id, searchUser.id]);


const handleImageUpload = async (file: File, type: 'profile' | 'banner') => {
  if (!user?.id) {
    toast("User ID is required.");
    return;
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('userId', user.id);
  formData.append('type', type);

  try {
    const response = await axios.post('/api/edit-profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    });

    const updatedImageUrl = response.data.imageUrl;

    if (type === 'profile') {
      user.profilePic = updatedImageUrl;
      setShowProfileImageModal(false);
      toast.success("Profile picture updated");
    } else if (type === 'banner') {
      user.bannerPic = updatedImageUrl;
      setShowBannerImageModal(false);
      toast.success("Banner picture updated");
    }
  } catch (error) {
    toast.error("Failed to upload image");
    console.error(error);
  }
};


const handleTextEdit = async () => {
  if (!user?.id) {
    toast("User ID is required.");
    return;
  }

  const formData = new FormData();
  formData.append('userId', user.id);
  formData.append('name', editedName);
  formData.append('title', editedTitle);
  formData.append('location', editedLocation);

  try {
    const response = await axios.post('/api/edit-profile', formData, {
      withCredentials: true,
    });

    toast.success("Profile details updated");
    setShowEditModal(false);
  } catch (error) {
    toast.error("Failed to update profile details");
    console.error(error);
  }
};





  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden relative">
      {/* Cover Photo */}
      <div className="h-48 bg-zinc-700 relative">
        <img
          src={searchUser.bannerPic || '/default.jpg'}
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
        <div className="relative -mt-28 mb-4">
          <div className="w-40 h-40 rounded-full border-1 border-white bg-gray-300 overflow-hidden">
            <img
              src={searchUser.profilePic || '/default.jpg'}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
            <button
            className="absolute bottom-2 left-30 p-2 bg-white rounded-full shadow-lg border hover:bg-gray-50 transition-colors"
            onClick={() => setShowProfileImageModal(true)}
          >
            <Camera className="w-4 h-4 text-gray-600" />
          </button>
        
          <button
                className="p-1 absolute bottom-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowEditModal(true)}
              >
                <Edit className="w-5 h-5" />
              </button>
        </div>

        {/* Name and Title */}
        <div className="flex flex-col items-  start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 ">
              <h1 className="text-2xl font-bold text-white">{editedName}</h1>
              
            </div>
            <p className="text-md text-gray-300 mb-2">{editedTitle}</p>
            <div className="flex items-center space-x-2 text-gray-400 mb-3">
              <div className="flex items-center text-sm space-x-1">
                <span>{editedLocation}</span>
              </div>
              <div className="flex items-center font-bold text-blue-400 text-sm space-x-1">
                <span>&#xB7;</span>
                  <span>Contact info</span>
              </div>
            </div>
            <div className="flex items-center font-bold space-x-4 text-sm text-gray-700">
              <span className="text-blue-400 hover:underline cursor-pointer">connections</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <button className="px-6 py-1 font-medium bg-blue-400 text-black rounded-full hover:bg-blue-300 transition-colors">
              Open to
            </button>
            <button className="px-6 py-1 border font-bold border-blue-400 text-blue-400 rounded-full hover:bg-blue-300 hover:bg-opacity-50 transition-colors">
              Add profile section
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`px-6 py-1 rounded-full transition-colors ${
              isFollowing
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-blue-400 text-black hover:bg-blue-300'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
          <button className="px-6 py-1 border border-blue-400 text-blue-400 rounded-full hover:bg-blue-50 transition-colors">
            <MessageCircle className="w-4 h-4 inline mr-2" />
            Message
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
                onClick={() => {
                  handleTextEdit();
                  setShowEditModal(false);
                }}
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
      handleImageUpload(imageFile, 'profile');
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
      handleImageUpload(imageFile, 'banner');
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
