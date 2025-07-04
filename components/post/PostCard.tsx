'use client';

import { Heart, MessageCircle, Share, Send, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

interface PostProps {
  post: {
    id: number;
    author: {
      name: string;
      title: string;
      avatar: string;
      time: string;
    };
    content: string;
    image?: string;
    likes: number;
    comments: number;
    shares: number;
  };
}

export default function Post({ post }: PostProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleComment = () => {
    if (comment.trim()) {
      console.log('Comment:', comment);
      setComment('');
    }
  };

  return (
    <div className="bg-zinc-900 rounded-lg">
      {/* Post Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-semibold  text-white hover:text-blue-600 cursor-pointer">
              {post.author.name}
            </h4>
            <p className="text-sm text-gray-300">{post.author.title}</p>
            <p className="text-xs text-gray-500">{post.author.time} ago</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-300 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
      
      {/* Post Content */}
      <div className="px-4 pb-4">
        <p className="text-white leading-relaxed text-sm">{post.content}</p>
      </div>
      
      {/* Post Image */}
      {post.image && (
        <div className="px-4 pb-4">
          <img
            src={post.image}
            alt="Post content"
            className="w-full rounded-lg"
          />
        </div>
      )}
      
      {/* Engagement Stats */}
      <div className="px-4 py-2 border-t flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <span>{post.likes + (isLiked ? 1 : 0)} likes</span>
          <span>{post.comments} comments</span>
        </div>
        <span>{post.shares} shares</span>
      </div>
      
      {/* Action Buttons */}
      <div className="px-4 py-2 border-t flex items-center justify-between">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 px-4 py-2 ${
            isLiked
              ? 'text-red-600 '
              : 'text-gray-300 hover:text-red-600 '
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span>Like</span>
        </button>
        
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-300 hover:text-blue-600 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Comment</span>
        </button>
        
        <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-300 hover:text-green-600  transition-colors">
          <Share className="w-5 h-5" />
          <span>Share</span>
        </button>
        
        <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-300 hover:text-blue-600 transition-colors">
          <Send className="w-5 h-5" />
          <span>Send</span>
        </button>
      </div>
      
      {/* Comments Section */}
      {showComments && (
        <div className="px-4 pb-4 border-t bg-gray-50">
          <div className="mt-4 flex space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
              <img
                src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                alt="Your profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex space-x-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
              />
              <button
                onClick={handleComment}
                disabled={!comment.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}