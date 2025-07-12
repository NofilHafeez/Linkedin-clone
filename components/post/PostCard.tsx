'use client';

import { Heart, MessageCircle, Share, Send, MoreHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { useSocket } from '../../context/SocketContext';
import toast from 'react-hot-toast';

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

export default function Post({ post }: { post: Post }) {
  const socket = useSocket();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [commentsList, setCommentsList] = useState<Comment[]>(post.comments || []);
  const [loadingLike, setLoadingLike] = useState(false);
  const [showLikesList, setShowLikesList] = useState(false);
  
  // const {setCount, setReceiverId} = useNotification();

  const handleNotification = async (message: string, receiverId: string) => {
    try {
      const res = await axios.post('api/notifications', {message, senderId: user?.id, receiverId}, {withCredentials: true});
    
      if (res.status === 201) {
        console.log('Notification sent successfully');
        
      }
    }catch (error) {
      toast.error("Failed sending notifications")
        console.error('Error sending notification:', error);
      }

    }

  useEffect(() => {
    if (user?.id && post.likes) {
      const liked = post.likes.some((like) => like.userId === user.id);
      setIsLiked(liked);
    }
    
  }, [post.likes, user?.id]);
  

const handleLike = async (postId: string) => {
  if (!user?.id || loadingLike) return;

  const newLikeState = !isLiked;
  const likeDelta = newLikeState ? 1 : -1;

  // Optimistic UI update
  setIsLiked(newLikeState);
  setLikesCount((prev) => prev + likeDelta);
  setLoadingLike(true);

  try {
    const res = await axios.post(
      `/api/likes/${postId}`,
      { userId: user.id },
      { withCredentials: true }
    );

    const { liked } = res.data;

    // If backend response disagrees, revert
    if (liked !== newLikeState) {
      setIsLiked(liked);
      setLikesCount((prev) => prev + (liked ? 1 : -1) - likeDelta);
    }

    // Only emit notification if it's a new like (not unlike)
    if (liked && post.userId !== user.id) {
      handleNotification('Liked your post', post.userId);

      if (socket) {
        socket.emit('send-like-noti', {
              message: 'Liked your post',
              receiverId: post.userId,
              sender: {
                id: user.id,
                name: user.name,
                profilePic: user.profilePic,
            },
        });
      }
    }
  } catch (err) {
    toast.error('Failed while performing like:');
    console.log('Error while performing like:', err)
    setIsLiked(!newLikeState);
    setLikesCount((prev) => prev - likeDelta);
  } finally {
    setLoadingLike(false);
  }
};


  const handleComment = async (postId: string) => {
  if (!comment.trim() || !user?.id) return;

  // Create a temporary comment for instant UI update
  const tempComment: Comment = {
    id: `temp-${Date.now()}`, // Temporary unique ID
    text: comment,
    commenterId: user.id,
    postId: postId,
    createdAt: new Date().toISOString(),
    commenter: {
      id: user.id,
      name: user.name,
      profilePic: user.profilePic || null,
    },
    likes: [],
  };

  // Instantly update UI
  setCommentsList((prev) => [...prev, tempComment]);
  setComment('');

  try {
    const res = await axios.post(
      `/api/comments/${postId}`,
      {
        text: comment,
        commenterId: user.id,
      },
      { withCredentials: true }
    );

    if (res.status === 200) {
      const newComment = res.data.comment;

      // Replace the temporary comment with the real one
      setCommentsList((prev) =>
        prev.map((c) => (c.id === tempComment.id ? newComment : c))
      );
    }

    if(post.userId !== user.id)  {// Avoid self-notification
        handleNotification(`New comment on your post: "${comment}"`, post.userId); 
         if (socket) {
        socket.emit('send-comment-noti', {
            message: `New comment on your post: "${comment}"`,
            receiverId: post.userId,
            sender: {
              id: user.id,
              name: user.name,
              profilePic: user.profilePic,
            },
          });
      }
  }
  } catch (error) {
    toast.error('Failed posting comment')
    console.error('Error posting comment:', error);
    setCommentsList((prev) => prev.filter((c) => c.id !== tempComment.id));
  }
};


  return ( 
    <div className="bg-zinc-900 rounded-lg relative">
      {/* Post Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={post.user.profilePic || '/default.jpg'}
              className="w-full h-full object-cover"
              alt="Profile"
            />
          </div>
          <div>
            <h4 className="font-semibold text-white hover:text-blue-600 cursor-pointer">
              {post.user.name}
            </h4>
            <p className="text-[12px] text-gray-300">{post.user.title}</p>
            <p className="text-[11px] text-gray-500">{new Date(post.createdAt).toLocaleDateString()} ago</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-300 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-4">
        <p className="text-white leading-relaxed text-sm">{post.text}</p>
      </div>

      {post.imageUrl && (
        <div className="pb-4">
          <img src={post.imageUrl} alt="Post content" className="w-full" />
        </div>
      )}

      {/* Engagement Stats */}
      <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-400 relative">
        <div className="flex items-center space-x-4">
          {/* Likes Text - Toggle Likes List */}
          <span
            onClick={() => setShowLikesList(!showLikesList)}
            className="cursor-pointer hover:underline"
          >
            {likesCount} likes
          </span>
          <span>{commentsList.length} comments</span>
        </div>
        <span>0 shares</span>

        {/* Likes List Popup */}
        {showLikesList && (
          <div className="absolute top-8 left-4 bg-zinc-800 text-white p-3 rounded-lg shadow-lg w-48 max-h-60 overflow-y-auto z-10">
            {post.likes && post.likes.length > 0 ? (
              post.likes.map((like) => (
                <div key={like.id} className="flex items-center space-x-2 mb-2">
                  <img
                    src={like.user.profilePic ||'/default.jpg'}
                    alt="User"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm">{like.user.name}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No likes yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-2 border-t flex items-center justify-between">
        <button
          onClick={() => handleLike(post.id)}
          disabled={loadingLike}
          className={`flex items-center space-x-2 px-4 py-2 ${
            isLiked ? 'text-red-600' : 'text-gray-300 hover:text-red-600'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span>Like</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-blue-600 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Comment</span>
        </button>

        <button className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-green-600 transition-colors">
          <Share className="w-5 h-5" />
          <span>Share</span>
        </button>

        <button className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-blue-600 transition-colors">
          <Send className="w-5 h-5" />
          <span>Send</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 pb-4 space-y-3">
          <div className="space-y-2 mt-4">
            {commentsList.map((cmt) => (
              <div key={cmt.id} className="flex space-x-3 items-start">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={cmt.commenter?.profilePic || '/default.jpg'}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-zinc-800 px-4 py-2 rounded-2xl text-sm text-white max-w-sm">
                  <span className="font-semibold text-blue-500">{cmt.commenter.name}:</span> {cmt.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-3 mt-4">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={user?.profilePic || '/default.jpg'}
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
                className="flex-1 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
              />
              <button
                onClick={() => handleComment(post.id)}
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
