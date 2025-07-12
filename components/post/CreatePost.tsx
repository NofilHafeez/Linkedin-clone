'use client';

import { Camera, Video, Calendar, FileText, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function PostCreator() {
  const [text, setText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { user } = useAuth();

  const handlePost = async () => {
    if (!text.trim() || !imageFile || !user?.id) {
      toast.error("Text, Image, and User are required.");
      return;
    }

    const formData = new FormData();
    formData.append("text", text);
    formData.append("image", imageFile);
    formData.append("userId", user.id);

    try {
      const res = await axios.post("/api/posts", formData, {
        withCredentials: true,
      });

      if (res.data) {
        toast.success("Post Created!")
        setText('');
        setImageFile(null);
        setShowModal(false);
      } else {
        toast.error(res.data.error || "Failed to create post");
        alert(res.data.error || "Failed to create post");
      }
    } catch (error) {
      toast.error("Failed when creating post")
      console.error("Error creating post:", error);
    }
  };

  return (
    <>
      {/* Compact Post Box */}
      <div className="bg-zinc-900 text-white rounded-lg p-4">
        <div className="flex space-x-3">
          <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
            <img
              src={user?.profilePic ?? '/default-profile.png'}
              alt="Your profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div
            onClick={() => setShowModal(true)}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 cursor-pointer rounded-lg px-4 py-3 text-gray-400"
          >
            Start a post...
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 h-screen flex items-center justify-center z-50">
          <div className="bg-zinc-900 text-white rounded-lg w-full max-w-lg p-6 relative space-y-4">
            
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <h2 className="text-lg font-semibold">Create a post</h2>

            {/* Textarea */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What do you want to talk about?"
              className="w-full p-3 rounded-lg bg-zinc-800 text-white outline-none resize-none"
              rows={5}
            />

            {/* Image Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImageFile(file);
              }}
              className="text-sm"
            />

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors">
                  <Camera className="w-5 h-5" />
                  <span className="text-sm">Photo</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors">
                  <Video className="w-5 h-5" />
                  <span className="text-sm">Video</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">Event</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors">
                  <FileText className="w-5 h-5" />
                  <span className="text-sm">Article</span>
                </button>
              </div>

              <button
                onClick={handlePost}
                disabled={!text.trim() || !imageFile}
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
