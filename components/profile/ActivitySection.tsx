"use client";

import { Edit, Heart, MessageCircle, Share, X } from 'lucide-react';
import { useState,useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Post {
  id: string | number;
  createdAt: string | number | Date;
  text?: string;
  imageUrl?: string;
  likes?: any[];
  comments?: any[];
}

export default function ActivitySection() {
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [expandedPost, setExpandedPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
    const { user } = useAuth();
  
    const fetchPosts = async () => {
      if (!user?.id) return;
      try {
        const response = await axios.get(`/api/posts/userId?userId=${user.id}`);
        if (response.status === 200 && Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          toast.error('Unexpected response format:');
        }
      } catch (error) {
        toast.error("Error fetching posts")
        console.error('Error fetching posts:', error);
      }
    };
  
    useEffect(() => {
      fetchPosts();
    }, [user?.id]);

  return (
    <>
      <div className="bg-zinc-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Activity</h2>
            <p className="text-sm text-gray-600">{posts.length} posts</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsCreatingPost(true)}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors text-sm"
            >
              Create a post
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Edit className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className={`cursor-pointer ${index !== posts.length - 1 ? 'border-b pb-6' : ''}`}
              onClick={() => setExpandedPost(post)}
            >
              <div className="flex space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="mb-2">
                    <span className="font-semibold text-white">You</span>
                    <span className="text-gray-600 text-sm ml-2">
                      • {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {post.text && (
                    <p className="text-white text-sm leading-relaxed line-clamp-2 mb-3">{post.text}</p>
                  )}

                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="Post"
                      className="w-full h-40 object-cover rounded mb-3"
                    />
                  )}

                  <div className="flex items-center space-x-6 text-sm text-white">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{post.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments?.length || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Share className="w-4 h-4" />
                      <span>0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {posts.length === 0 && (
            <p className="text-gray-500 text-center mt-6">No activity yet.</p>
          )}
        </div>

        <div className="mt-6 pt-6 border-t text-center">
          <button className="text-blue-600 hover:underline font-medium">
            Show all activity
          </button>
        </div>
      </div>

      {/* Create Post Modal */}
      {isCreatingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 w-full max-w-lg mx-4 p-6 rounded-lg relative">
            <button
              onClick={() => setIsCreatingPost(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-white mb-4">Create a Post</h3>
            <textarea
              rows={5}
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 focus:outline-none"
              placeholder="What's on your mind?"
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setIsCreatingPost(false)}
                className="px-4 py-2 text-white border border-gray-600 rounded hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Post View */}
      {expandedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-zinc-900 w-full max-w-3xl mx-4 p-6 rounded-xl relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setExpandedPost(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-white font-semibold">You</h4>
                <p className="text-sm text-gray-500">
                  {new Date(expandedPost.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            {expandedPost.text && (
              <p className="text-white text-sm leading-relaxed mb-4">
                {expandedPost.text}
              </p>
            )}
            {expandedPost.imageUrl && (
              <img
                src={expandedPost.imageUrl}
                alt="Post"
                className="w-full max-h-[500px] object-cover rounded mb-4"
              />
            )}
            <div className="flex space-x-6 text-white text-sm mt-2">
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{expandedPost.likes?.length || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{expandedPost.comments?.length || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Share className="w-4 h-4" />
                <span>0</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
