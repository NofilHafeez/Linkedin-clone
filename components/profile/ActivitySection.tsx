'use client';

import { Edit, Heart, MessageCircle, Share } from 'lucide-react';

type Post = {
  id: string | number;
  createdAt: string | number | Date;
  text?: string;
  imageUrl?: string;
  likes?: any[];
  comments?: any[];
};

interface ActivitySectionProps {
  posts?: Post[];

  
}



export default function ActivitySection({ posts = [] }: ActivitySectionProps) {

  return (
    <div className="bg-zinc-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Activity</h2>
          <p className="text-sm text-gray-600">{posts.length} posts</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors text-sm">
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
            className={`${index !== posts.length - 1 ? 'border-b pb-6' : ''}`}
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
                  <p className="text-white text-sm leading-relaxed mb-3">{post.text}</p>
                )}

                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="Post Image"
                    className="w-full max-h-96 object-cover rounded mb-3"
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
                    <span>0</span> {/* You can add shares logic later */}
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
  );
}
