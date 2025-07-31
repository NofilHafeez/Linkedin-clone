import { Comment, Like } from './index';

export interface Post {
  id: string;
  text: string;
  imageUrl: string;
  createdAt: string;
  userId: string;
  user: {
    id: string;
    name: string;
    profilePic?: string | null;
    title?: string;
  };
  comments: Comment[];
  likes: Like[];
}

