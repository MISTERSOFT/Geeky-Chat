import { User, Message } from ".";

export interface Room {
  id: string;
  name: string;
  owner: string; // User
  users: User[];
  messages: Message[];
}
