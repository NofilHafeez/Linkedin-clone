import { User, Post } from './index';

export interface Like {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
  post: Post;
  user: User;
}
