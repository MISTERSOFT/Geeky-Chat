import { User } from ".";

export interface Message {
  createdAt: Date;
  text: string;
  user: User;
}

export interface MessageSent {
  text: string;
  userId: string; // User UUID
}
