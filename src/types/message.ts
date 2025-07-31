import { Room, User } from './index';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  roomId: string;
  room: Room;
  sender: User;
}
