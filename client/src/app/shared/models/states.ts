export interface RoomState {
  roomId: string;
  users: UserState[];
}

export interface UserState {
  userId: string;
  status: UserStatus;
  isTyping: boolean;
}

export enum UserStatus {
  AFK,
  BUSY,
  ONLINE,
  OFFLINE
}
