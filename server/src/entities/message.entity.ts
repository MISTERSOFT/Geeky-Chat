import { Room, User } from '.';
export class MessageDOC {
  _id: string;
  _rev: string;
  doc_type = 'message';
  created_at: Date;
  text: string;
  user_id: string;
  room_id: string;
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

export interface Message {
  _id: string;
  _rev: string;
  created_at: Date;
  text: string;
  user: User;
  room_id: string;
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
