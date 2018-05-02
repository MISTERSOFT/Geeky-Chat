import { RoomDTO } from "../dtos";
import { Room, Message, User } from "../entities";
import { UserConverter, MessageConverter } from ".";

export class RoomConverter {
  private readonly _userConverter = new UserConverter();
  private readonly _messageConverter = new MessageConverter();
  toEntity(source: RoomDTO): Room {
    if (!source) return null;

    const target = new Room();
    target._id = source.id;
    target.name = source.name;
    // target.name_slug = source.name_slug;
    target.owner = source.owner;

    return target;
  }
  toDTO(source: Room): RoomDTO {
    if (!source) return null;

    const target = new RoomDTO();
    target.id = source._id;
    target.name = source.name;
    // target.name_slug = source.name_slug;
    target.owner = source.owner;
    // target.messages = this._messageConverter.toDTOs(<Message[]>source.messages);
    // target.users = this._userConverter.toDTOs(<User[]>source.users);

    return target;
  }

  toDTOs(source: Room[]): RoomDTO[] {
    if (!source) return null;
    return source.map(src => this.toDTO(src));
  }

}
