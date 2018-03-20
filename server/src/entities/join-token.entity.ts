import { RoomDOC } from './room.entity';
export class JoinTokenDOC {
  id: string;
  expireAt: Date;
  token: string;
  room: RoomDOC;
}

export class JoinToken {
  id: string;
  expireAt: Date;
  token: string;
  room: string;
}
