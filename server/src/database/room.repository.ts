import { Database } from './database';
import { Room } from '../entities';

export class RoomRepository extends Database {
  constructor() {
    super();
  }
  store(obj) {
    return this.DB.rel.save(this.KEYS.room, obj);
  }
  // TODO: Get all rooms for user
  getAllForUser(userId: string) {
    // return this.DB.rel.findHasMany(this.KEYS.room, this.KEYS.user, userId);
    return this.DB.rel.find(this.KEYS.room);
  }
}

export const roomRepository = new RoomRepository();
