import { UserDTO } from "./user.dto";

export class MessageDTO {
  id: string;
  created_at: Date;
  text: string;
  user: UserDTO;
  room_id: string;
}

export class MessageLiteDTO {
  created_at: Date;
  text: string;
  userId: string;
  roomId: string;
}
