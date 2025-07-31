import { Status } from './enum';
import { Comment, Like, Connection, Notification, Post, Room, Message } from './index';

export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  createdAt: string;
  password?: string;
  profilePic?: string;
  status: Status;
  bannerPic?: string;
  location?: string;
  title?: string;
  education?: any;
  experience?: any;
  skills?: any;
  viewedProfile: number;
  comments: Comment[];
  receivedConnections: Connection[];
  sentConnections: Connection[];
  likes: Like[];
  sentMessages: Message[];
  receivedNotifications: Notification[];
  sentNotifications: Notification[];
  posts: Post[];
  rooms: Room[];
}
