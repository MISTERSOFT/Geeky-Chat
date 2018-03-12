import { UserDTO } from "./user.dto";

export class MessageDTO {
  createdAt: Date;
  text: string;
  user: UserDTO;
}

export class MessageLiteDTO {
  createdAt: Date;
  text: string;
  userId: string;
}
