import { UserConverter } from './user.converter';
import { Message, User, MessageDOC } from '../entities';
import { MessageDTO, MessageLiteDTO } from '../dtos';
export class MessageConverter {
  private readonly _userConverter: UserConverter = new UserConverter();
  toEntity(source: MessageLiteDTO): MessageDOC {
    if (!source) return null;

    const target = new MessageDOC();
    target.createdAt = source.createdAt;
    target.text = source.text;
    target.user = source.userId;
    target.room = source.roomId;

    return target;
  }
  toDTO(source: Message): MessageDTO {
    if (!source) return null;

    const target = new MessageDTO();
    target.createdAt = source.createdAt;
    target.text = source.text;
    target.user = this._userConverter.toDTO(source.user);

    return target;
  }

  toDTOs(source: Message[]): MessageDTO[] {
    if (!source) return null;
    return source.map(message => this.toDTO(message));
  }

}
