"use client";

import { Edit, Heart, MessageCircle, Share, X } from 'lucide-react';
import { useState } from 'react';

export interface UserBasic {
  id: string;
  name: string;
  profilePic: string | null;
}

export interface Like {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
  user: UserBasic;
}

export interface Comment {
  id: string;
  text: string;
  commenterId: string;
  postId: string;
  createdAt: string;
  commenter: UserBasic;
  likes: Like[];
}

export interface Post {
  id: string;
  text: string;
  imageUrl: string;
  createdAt: string;
  userId: string;
  user: UserWithTitle;
  likes: Like[];
  comments: Comment[];
}

export interface UserWithTitle extends UserBasic {
  title: string;
}

interface ActivityHeaderProps {
  userPosts: Post[];
}

export default function ActivitySection({ userPosts }: ActivityHeaderProps) {
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [expandedPost, setExpandedPost] = useState<Post | null>(null);
  const [showAllOverlay, setShowAllOverlay] = useState(false); // <-- NEW

  const visiblePosts = userPosts.slice(0, 3); // <-- Limit to 3 initially

  return (
    <>
      <div className="bg-zinc-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Activity</h2>
            <p className="text-sm text-gray-600">{userPosts.length} posts</p>
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
          {visiblePosts.map((post, index) => (
            <div
              key={post.id}
              className={`${index !== visiblePosts.length - 1 ? 'border-b-[0.2px] border-gray-400 pb-3' : ''}`}
              onClick={() => setExpandedPost(post)}
            >
              <div className="flex space-x-3">
                <div className="flex-1">
                  <div className="mb-1">
                    <span className="font-semibold text-xs text-gray-400">{post.user.name} repostited this</span>
                    <span className="text-gray-600 text-xs ml-1">
                      • {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className='flex gap-3 mb-4'>
                    <div className='h-17 w-17 rounded-lg'>
                      {post.imageUrl && (
                        <img
                          src={post.imageUrl}
                          alt="Post"
                          className="w-full h-full object-cover rounded-lg mb-3"
                        />
                      )}
                    </div>
                    {post.text && (
                      <p className="text-white text-sm leading-relaxed line-clamp-2 mb-3">{post.text}</p>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-2 w-full text-sm text-white">
                    <div className="flex text-gray-400 items-center space-x-1">
                      <span>{post.likes?.length || 0} Likes</span>
                    </div>
                    <div className="flex items-center text-gray-400 space-x-1">
                      <span>{post.comments?.length || 0} comments</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {visiblePosts.length === 0 && (
            <p className="text-gray-500 text-center mt-6">No activity yet.</p>
          )}
        </div>

        <div className="mt-6 pt-6 border-t text-center">
          <button
            onClick={() => setShowAllOverlay(true)}
            className="text-gray-400 cursor-pointer hover:underline font-medium"
          >
            Show all posts -
          </button>
        </div>
      </div>

   {showAllOverlay && (
  <div className="fixed h-screen inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto px-4 py-10">
    <div className="bg-zinc-900 w-full max-w-3xl  rounded-xl relative mt-10 mb-10">
      <button
        onClick={() => setShowAllOverlay(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
      >
        <X className="w-5 h-5" />
      </button>
      <h2 className="text-xl px-6 pt-6 font-semibold text-white mb-6">All Activity</h2>

      <div className="space-y-8">
        {userPosts.map((post) => (
          <div
            key={post.id}
            className="border-b border-zinc-700 pb-6 cursor-pointer"
            onClick={() => setExpandedPost(post)}
          >
            {/* Header */}
            <div className="flex px-6 items-start gap-3 mb-3">
              <img
                src={post.user.profilePic || '/default-avatar.png'}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="text-sm font-semibold text-white">{post.user.name}</div>
                <div className="text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Text */}
            {post.text && <p className="text-white px-6 text-sm mb-3">{post.text}</p>}

            {/* Image */}
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post"
                className="w-full max-h-[400px] object-cover rounded mb-3"
              />
            )}

            {/* Meta Info */}
            <div className="text-gray-400 px-6 text-sm">
              {post.likes?.length || 0} likes • {post.comments?.length || 0} comments
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}



    </>
  );
}
