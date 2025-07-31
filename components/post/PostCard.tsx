'use client';

import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { useSocket } from '../../context/SocketContext';
import type { Post as PostType, Comment } from '@/types/index';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function Post({ post }: { post: PostType }) {
  const socket = useSocket();
  const { user } = useAuth();

  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [commentsList, setCommentsList] = useState<Comment[]>(post.comments || []);
  const [loadingLike, setLoadingLike] = useState(false);
  const [showLikesList, setShowLikesList] = useState(false);

  // Memoize whether user has liked the post
  const isLiked = useMemo(() => {
    return !!(user?.id && post.likes?.some((like) => like.userId === user.id));
  }, [post.likes, user?.id]);

  const handleNotification = useCallback(async (message: string, receiverId: string) => {
    if (!user?.id || receiverId === user.id) return;

    try {
      const res = await axios.post('/api/notifications', {
        message,
        senderId: user.id,
        receiverId
      }, { withCredentials: true });

      if (res.status === 201) {
        socket?.emit('send-noti', {
          message,
          receiverId,
          sender: {
            id: user.id,
            name: user.name,
            profilePic: user.profilePic,
          }
        });
      }
    } catch (error) {
      toast.error('Notification failed');
      console.error(error);
    }
  }, [user, socket]);

  const handleLike = useCallback(async (postId: string) => {
    if (!user?.id || loadingLike) return;

    const optimisticLike = !isLiked;
    setLikesCount((prev) => prev + (optimisticLike ? 1 : -1));
    setLoadingLike(true);

    try {
      const { data } = await axios.post(`/api/likes/${postId}`, {
        userId: user.id
      }, { withCredentials: true });

      if (data.liked !== optimisticLike) {
        setLikesCount((prev) => prev + (data.liked ? 1 : -1) - (optimisticLike ? 1 : -1));
      }

      if (data.liked) {
        handleNotification('Liked your post', post.userId);
      }
    } catch (error) {
      toast.error('Like failed');
      setLikesCount((prev) => prev - (optimisticLike ? 1 : -1));
    } finally {
      setLoadingLike(false);
    }
  }, [user?.id, isLiked, loadingLike, handleNotification, post.userId]);

  const handleComment = useCallback(async (postId: string) => {
    if (!comment.trim() || !user?.id) return;

    const tempId = `temp-${Date.now()}`;
    const tempComment: Comment = {
      id: tempId,
      text: comment,
      commenterId: user.id,
      postId,
      createdAt: new Date().toISOString(),
      commenter: {
        id: user.id,
        name: user.name,
        profilePic: user.profilePic ?? null
      }
    };

    setCommentsList((prev) => [...prev, tempComment]);
    setComment('');

    try {
      const res = await axios.post(`/api/comments/${postId}`, {
        text: comment,
        commenterId: user.id
      }, { withCredentials: true });

      if (res.status === 200) {
        const newComment = res.data.comment;
        setCommentsList((prev) =>
          prev.map((c) => (c.id === tempId ? newComment : c))
        );

        handleNotification(`New comment: "${comment}"`, post.userId);
      }
    } catch (error) {
      toast.error('Comment failed');
      setCommentsList((prev) => prev.filter((c) => c.id !== tempId));
    }
  }, [comment, user, post.userId, handleNotification]);

  //  Memoize rendered likes list
  const renderedLikesList = useMemo(() => (
    post.likes?.length ? (
      post.likes.map((like) => (
        <div key={like.id} className="flex items-center space-x-2 mb-2">
          <Image
            src={like.user.profilePic || '/default.jpg'}
            width={24}
            height={24}
            alt="User"
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-sm">{like.user.name}</span>
        </div>
      ))
    ) : (
      <p className="text-sm text-gray-400">No likes yet.</p>
    )
  ), [post.likes]);

  // Memoize rendered comments
  const renderedComments = useMemo(() => (
    commentsList.map((cmt) => (
      <div key={cmt.id} className="flex space-x-3 items-start">
        <Image
          src={cmt.commenter?.profilePic || '/default.jpg'}
          alt="User"
          className="w-8 h-8 rounded-full object-cover"
          width={32}
          height={32}
        />
        <div className="bg-zinc-800 px-4 py-2 rounded-2xl text-sm text-white max-w-sm">
          <span className="font-semibold text-blue-500">{cmt.commenter.name}:</span> {cmt.text}
        </div>
      </div>
    ))
  ), [commentsList]);

  return (
    <div className="bg-zinc-900 rounded-lg relative overflow-hidden">
      {/* Header */}
      <div className="p-4 flex justify-between">
        <div className="flex space-x-3">
          <Image
            src={post.user.profilePic || '/default.jpg'}
            alt="Profile"
            width={55}
            height={30}
            className="rounded-full object-cover"
          />
          <div>
            <h4 className="font-semibold text-white hover:text-blue-600">{post.user.name}</h4>
            <p className="text-xs text-gray-300">{post.user.title}</p>
            <p className="text-[11px] text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <MoreHorizontal className="text-gray-400 hover:text-gray-300 cursor-pointer" />
      </div>

      {/* Text */}
      <div className="px-4 pb-4 text-white text-sm">{post.text}</div>

      {/* Image */}
      {post.imageUrl && (
        <div className="pb-4">
          <div className="relative w-full aspect-video">
            <Image
              src={post.imageUrl}
              alt="Post content"
              fill
              className="object-cover rounded"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-2 flex justify-between text-sm text-gray-400 relative">
        <div className="flex gap-4">
          <span
            onClick={() => setShowLikesList(!showLikesList)}
            className="cursor-pointer hover:underline"
          >
            {likesCount} likes
          </span>
          <span>{commentsList.length} comments</span>
        </div>

        {showLikesList && (
          <div className="absolute top-10 left-4 z-20 bg-zinc-800 rounded p-3 text-white w-52 max-h-60 overflow-y-auto shadow-lg">
            {renderedLikesList}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-20 py-2 border-t flex justify-between">
        <button
          onClick={() => handleLike(post.id)}
          disabled={loadingLike}
          className={`flex items-center space-x-2 px-4 py-2 ${
            isLiked ? 'text-red-600' : 'text-gray-300 hover:text-red-600'
          }`}
          aria-label="Like"
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-blue-600"
          aria-label="Comment"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="px-4 pb-4 space-y-4">
          <div className="space-y-3">{renderedComments}</div>
          <div className="flex space-x-3">
            <Image
              src={user?.profilePic || '/default.jpg'}
              alt="You"
              width={38}
              height={38}
              className="rounded-full object-cover"
            />
            <div className="flex-1 flex space-x-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-full text-white placeholder-gray-400 focus:ring-blue-500 focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
              />
              <button
                onClick={() => handleComment(post.id)}
                disabled={!comment.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
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
