import { Database } from './database';
import { User, RoomDOC } from '../entities';

export class UserRepository extends Database {
  constructor() {
    super();
  }
  isUserExist(user: User) {
    return this.DB.rel.find(this.KEYS.user)
      .then(response => {
        const userData = response.users.find(u => u.email === user.email && u.password === user.password)
        return { user: userData, founded: userData !== undefined }
      })
  }
  storeUser(obj: User) {
    return this.DB.rel.save(this.KEYS.user, obj)
  }
  getById(userId: string): Promise<User> {
    return this.DB.rel.find(this.KEYS.user, userId)
    .then(docs => {
      return (docs.users.length === 1) ? docs.users[0] : null;
    });
  }

  // TODO: Try to use this in RoomRepo
  getUsersByRoom(roomId: string): Promise<User[]> {
    return this.DB.rel.find(this.KEYS.room).then(docs => {
      const users: User[] = []
      const room: RoomDOC = docs.rooms.find((roomDoc: RoomDOC) => roomDoc.id === roomId)
      if (!room) {
        return []
      }
      docs.users.forEach((user: User) => {
        if (room.users.findIndex(u => u === user.id) !== -1) {
          users.push(user)
        }
      })
      return users
    })
  }
}

export const userRepository = new UserRepository();
