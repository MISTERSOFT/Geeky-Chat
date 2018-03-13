import { Database } from './database';
import { User } from '../entities';

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
  findUserById(userId: string) {
    return this.DB.rel.find(this.KEYS.user, userId)
  }
}

export const userRepository = new UserRepository();
