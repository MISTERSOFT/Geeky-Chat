import { Room, User } from '.';
export class Message {
  id: string;
  createdAt: Date;
  text: string;
  user: User;
  room: Room;
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

export class MessageDOC {
  id: string;
  createdAt: Date;
  text: string;
  user: string;
  room: string;
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
