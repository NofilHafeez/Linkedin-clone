import { User, Message } from './index';

export interface Room {
  id: string;
  name?: string;
  isGroup: boolean;
  createdAt: string;
  messages: Message[];
  users: User[];
}
