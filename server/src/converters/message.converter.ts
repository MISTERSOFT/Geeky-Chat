import { UserConverter } from './user.converter';
import { Message, User, MessageDOC } from '../entities';
import { MessageDTO, MessageLiteDTO } from '../dtos';
export class MessageConverter {
  private readonly _userConverter: UserConverter = new UserConverter();
  toEntity(source: MessageLiteDTO): MessageDOC {
    if (!source) return null;

    const target = new MessageDOC();
    target.created_at = source.created_at;
    target.text = source.text;
    target.user_id = source.userId;
    target.room_id = source.roomId;

    return target;
  }
  toDTO(source: Message): MessageDTO {
    if (!source) return null;

    const target = new MessageDTO();
    target.created_at = source.created_at;
    target.text = source.text;
    target.user = this._userConverter.toDTO(source.user);
    target.room_id = source.room_id

    return target;
  }

  toDTOs(source: Message[]): MessageDTO[] {
    if (!source) return null;
    return source.map(message => this.toDTO(message));
  }

}
