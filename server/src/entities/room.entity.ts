import { User, Message } from '.';
export class Room {
  /**
   * Room name
   */
  id: UUID;
  name: string;
  owner: string; // User
  users: any[] = []; // User
  messages: any[] = []; // Message
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
