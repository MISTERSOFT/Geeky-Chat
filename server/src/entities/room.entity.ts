import { User, Message } from '.';
export class Room {
  _id: string;
  _rev: string;
  doc_type = 'room';
  name: string;
  owner: string; // User
  // users: User[] = []; // User
  // messages: Message[] = []; // Message
  join_tokens: JoinToken[] = [];
  constructor(data?) {
    if (data) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          this[key] = data[key];
        }
      }
    }
  }
}

export interface RoomDOC {
  _id: string;
  _rev: string;
  name: string;
  owner: string; // User
  // users: string[]; // User
  // messages: string[]; // Message
  join_tokens: JoinToken[];
  // constructor(data?) {
  //   if (data) {
  //     for (const key in data) {
  //       if (this.hasOwnProperty(key)) {
  //         this[key] = data[key];
  //       }
  //     }
  //   }
  // }
}

export interface JoinToken {
  expireAt: Date;
  token: string;
}
