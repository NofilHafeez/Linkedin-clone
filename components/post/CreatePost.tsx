'use client';

import {
  Camera,
  Video,
  Calendar,
  FileText,
  X
} from 'lucide-react';
import {
  useCallback,
  useState,
  useMemo
} from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function PostCreator() {
  const [text, setText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { user } = useAuth();

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const handlePost = useCallback(async () => {
    if (!text.trim() || !imageFile || !user?.id) {
      toast.error("Text, Image, and User are required.");
      return;
    }

    const formData = new FormData();
    formData.append("text", text);
    formData.append("image", imageFile);
    formData.append("userId", user.id);

    try {
      const res = await axios.post("/api/posts", formData, { withCredentials: true });

      if (res.data) {
        toast.success("Post Created!");
        setText('');
        setImageFile(null);
        setPreviewUrl(null);
        setShowModal(false);
      } else {
        toast.error(res.data.error || "Failed to create post");
      }
    } catch (error) {
      toast.error("Failed when creating post");
      console.error("Error creating post:", error);
    }
  }, [text, imageFile, user?.id]);

  const isPostDisabled = useMemo(() => !text.trim() || !imageFile, [text, imageFile]);

  return (
    <>
      {/* Compact Post Box */}
      <div className="bg-zinc-900 text-white rounded-lg p-4">
        <div className="flex space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={user?.profilePic ?? '/default.jpg'}
              alt="Your profile"
              width={48}
              height={48}
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
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold">Create a post</h2>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What do you want to talk about?"
              className="w-full p-3 rounded-lg bg-zinc-800 text-white outline-none resize-none"
              rows={5}
            />

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-300">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm"
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mt-2 rounded max-h-52 object-cover"
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-2">
              <div className="flex space-x-4 text-gray-400">
                <IconButton icon={Camera} label="Photo" />
                <IconButton icon={Video} label="Video" />
                <IconButton icon={Calendar} label="Event" />
                <IconButton icon={FileText} label="Article" />
              </div>

              <button
                onClick={handlePost}
                disabled={isPostDisabled}
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
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

function IconButton({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors" aria-label={label}>
      <Icon className="w-5 h-5" />
      <span className="text-sm hidden sm:inline">{label}</span>
    </button>
  );
}
