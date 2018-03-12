import { UserConverter } from './user.converter';
import { Message, User } from '../entities';
import { MessageDTO, MessageLiteDTO } from '../dtos';
export class MessageConverter {
  private readonly _userConverter: UserConverter = new UserConverter();
  toEntity(source: MessageLiteDTO): Message {
    if (!source) return null;

    const target = new Message();
    target.createdAt = source.createdAt;
    target.text = source.text;
    target.user = source.userId;

    return target;
  }
  toDTO(source: Message): MessageDTO {
    if (!source) return null;

    const target = new MessageDTO();
    target.createdAt = source.createdAt;
    target.text = source.text;
    target.user = this._userConverter.toDTO(<User>source.user);

    return target;
  }

}
