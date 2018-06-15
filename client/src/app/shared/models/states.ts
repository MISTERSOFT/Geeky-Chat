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

export interface ChatStateChange {
  userId: string;
  status: UserStatus;
  isTyping: boolean;
}

export interface ChatStateChangeSingle extends ChatStateChange {
  roomId: string;
}

export interface ChatStateChangeMultiple extends ChatStateChange {
  roomIds: string[];
}
