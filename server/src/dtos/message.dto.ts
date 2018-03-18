import { UserDTO } from "./user.dto";

export class MessageDTO {
  id: string;
  createdAt: Date;
  text: string;
  user: UserDTO;
}

export class MessageLiteDTO {
  createdAt: Date;
  text: string;
  userId: string;
  roomId: string;
}
