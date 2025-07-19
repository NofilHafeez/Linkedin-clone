'use client';

import PostCreator from './CreatePost';
import Post from './PostCard';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PostSkeleton from '../skeleton/PostSkeleton';
import axios from 'axios';

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
  likes?: Like[];
  comments: Comment[];
}

export interface UserWithTitle extends UserBasic {
  title: string;
}


export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const fetchPosts = async () => {
    if (!user?.id) return;
    try {
      const response = await axios.get(`/api/posts/userId?userId=${user.id}`);
      if (response.status === 200 && Array.isArray(response.data)) {
        setPosts(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user?.id]);

  if (loading) {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex gap-3 p-4 rounded-md animate-pulse bg-zinc-900'>
          <div className='h-12 w-14 rounded-full bg-zinc-700'></div>
          <div className='h-13 rounded-md w-full bg-zinc-700'></div>
        </div>
        <PostSkeleton/>
        <PostSkeleton/>
        <PostSkeleton/>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PostCreator />
      
      <div className="space-y-4">
        {posts.length === 0 ?
        (<h1 className="text-white text-xs text-center">No posts available</h1>)
        : (
          posts.map((post) => (
          <Post key={post.id} post={post} />
        ))
        )}
        
      </div>
    </div>
  );
}