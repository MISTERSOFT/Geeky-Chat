import { User } from './../entities/user.entity';

export class Tools {

  static toPlainObjectToken(user: User) {
    return {
      email: user.email,
      id: user._id,
      username: user.username
    }
  }

}
