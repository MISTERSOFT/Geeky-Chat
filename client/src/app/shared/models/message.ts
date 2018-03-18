import { User } from ".";

export interface Message {
  createdAt: Date;
  text: string;
  user: User;
  isMine: boolean;
}

export interface MessageSent {
  text: string;
  userId: string; // User UUID
  roomId: string;
}
