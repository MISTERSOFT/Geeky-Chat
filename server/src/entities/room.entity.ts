import { User, Message } from '.';
export class Room {
  id: string;
  name: string;
  name_slug: string;
  owner: string; // User
  users: User[] = []; // User
  messages: Message[] = []; // Message
  constructor(data?) {
    if (data) {
      for (const key in data) {
        if (this.hasOwnProperty(key)) {
          this[key] = data[key];
        }
      }
    }
  }
}

export class RoomDOC {
  id: string;
  name: string;
  name_slug: string;
  owner: string; // User
  users: string[] = []; // User
  messages: string[] = []; // Message
  constructor(data?) {
    if (data) {
      for (const key in data) {
        if (this.hasOwnProperty(key)) {
          this[key] = data[key];
        }
      }
    }
  }
}
