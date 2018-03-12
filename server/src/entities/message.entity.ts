import { User } from './user.entity';
export class Message {
  id: string;
  createdAt: Date;
  text: string;
  user: User|string;
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
