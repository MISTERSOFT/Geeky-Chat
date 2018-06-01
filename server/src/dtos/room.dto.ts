import { MessageDTO, UserDTO } from ".";

export class RoomDTO {
  id: string;
  name: string;
  // name_slug: string;
  owner: string;
  messages: MessageDTO[] = [];
  users: UserDTO[] = [];
}
