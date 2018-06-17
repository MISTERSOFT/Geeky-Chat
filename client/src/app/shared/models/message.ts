import { User } from ".";

export class Message {
  created_at: Date;
  text: string;
  user: User;
  isMine: boolean;
  constructor(data) {
    this.created_at = data.created_at;
    this.text = data.text;
    this.user = data.user;
  }
}

export interface MessageSent {
  text: string;
  userId: string; // User UUID
  roomId: string;
}
