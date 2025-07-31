import { User } from './index';

export interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  receiverId: string;
  senderId: string;
  receiver: User;
  sender: User;
}
