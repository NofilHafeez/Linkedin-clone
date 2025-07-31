'use client';

import { Edit, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Post } from '@/types';
import { useAuth } from '../../context/AuthContext';

interface ActivityHeaderProps {
  userPosts: Post[];
  searchUserId: string;
}

export default function ActivitySection({ userPosts, searchUserId}: ActivityHeaderProps) {
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [expandedPost, setExpandedPost] = useState<Post | null>(null);
  const [showAllOverlay, setShowAllOverlay] = useState(false);
  const { user } = useAuth();

  const visiblePosts = useMemo(() => userPosts.slice(0, 3), [userPosts]);

  const PostItem = ({ post }: { post: Post}) => (
    <div
      key={post.id}
      onClick={() => setExpandedPost(post)}
      className="cursor-pointer"
    >
      <div className="flex space-x-3">
        <div className="flex-1">
          <div className="mb-1">
            <span className="font-semibold text-xs text-gray-400">{post.user.name} reposted this</span>
            <span className="text-gray-600 text-xs ml-1">
              • {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex gap-3 mb-4">
            {post.imageUrl && (
              <div className="w-20 h-20 rounded-lg overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt="Post image"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {post.text && (
              <p className="text-white text-sm leading-relaxed line-clamp-2">
                {post.text}
              </p>
            )}
          </div>
          <div className="flex justify-between items-center text-sm text-gray-400">
            <span>{post.likes?.length || 0} Likes</span>
            <span>{post.comments?.length || 0} Comments</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-zinc-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Activity</h2>
            <p className="text-sm text-gray-600">{userPosts.length} posts</p>
          </div>
          <div className="flex items-center space-x-2">
          {user?.id === searchUserId && (
              <button
              onClick={() => setIsCreatingPost(true)}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition text-sm"
              aria-label="Create a new post"
            >
              Create a post
            </button>
          )}  
            <button
              className="p-2 text-gray-400 hover:text-gray-600"
              aria-label="Edit activity"
            >
               {user?.id === searchUserId && (
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              <Edit className="w-5 h-5" />
            </button>
          )}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {visiblePosts.map((post, idx) => (
            <div
              key={post.id}
              className={idx !== visiblePosts.length - 1 ? 'border-b border-gray-700 pb-3' : ''}
            >
              <PostItem post={post} />
            </div>
          ))}

          {visiblePosts.length === 0 && (
            <p className="text-gray-500 text-center mt-6">No activity yet.</p>
          )}
        </div>

        {userPosts.length > 3 && (
          <div className="mt-6 pt-6 border-t text-center">
            <button
              onClick={() => setShowAllOverlay(true)}
              className="text-gray-400 hover:underline font-medium"
              aria-label="Show all posts"
            >
              Show all posts -
            </button>
          </div>
        )}
      </div>

      {/* Full-screen overlay for all posts */}
      {showAllOverlay && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto px-4 py-10">
          <div className="bg-zinc-900 w-full max-w-3xl mx-auto rounded-xl relative mt-10 mb-10">
            <button
              onClick={() => setShowAllOverlay(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              aria-label="Close overlay"
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
                  <div className="flex px-6 items-start gap-3 mb-3">
                    <img
                      src={post.user.profilePic || '/default-avatar.png'}
                      alt={`${post.user.name}'s avatar`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-sm font-semibold text-white">{post.user.name}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {post.text && <p className="text-white px-6 text-sm mb-3">{post.text}</p>}

                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="Post image"
                      className="w-full max-h-[400px] object-cover rounded mb-3"
                    />
                  )}

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
