import { User } from ".";

export interface Message {
  created_at: Date;
  text: string;
  user: User;
  isMine: boolean;
}

export interface MessageSent {
  text: string;
  userId: string; // User UUID
  roomId: string;
}
