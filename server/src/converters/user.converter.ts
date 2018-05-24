import { User } from '../entities';
import { UserDTO } from '../dtos';
export class UserConverter {
  toEntity(source: UserDTO): User {
    if (!source) return null;

    const target = new User();
    target.email = source.email;
    target.password = source.password;
    target.username = source.username;
    target.avatar = source.avatar;

    return target;
  }
  toDTO(source: User): UserDTO {
    if (!source) return null;

    const target = new UserDTO();
    target.email = source.email;
    target.id = source._id;
    target.username = source.username;
    target.avatar = source.avatar;

    return target;
  }

  toDTOs(source: User[]): UserDTO[] {
    if (!source) return null;
    return source.map(user => this.toDTO(user));
  }

  toPlainObject(user: User) {
    return {
      email: user.email,
      id: user._id,
      username: user.username,
      avatar: user.avatar
    }
  }
}
