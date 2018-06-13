
export class RuntimeChatState {
  rooms: RuntimeRoomState[];
  constructor() {
    this.rooms = [];
  }

  getRoomsStates(roomIds: string[]): RuntimeRoomState[] {
    const states: RuntimeRoomState[] = []
    roomIds.forEach(roomId => {
      states.push(this.rooms.find(r => r.roomId === roomId))
    })
    return states
  }
}

export class RuntimeRoomState {
  roomId: string;
  users: RuntimeUserState[];
  constructor(_roomId: string) {
    this.roomId = _roomId
    this.users = []
  }
}

export class RuntimeUserState {
  userId: string;
  status: UserStatus;
  isTyping: boolean;
  constructor(_userId: string) {
    this.userId = _userId
    this.status = UserStatus.OFFLINE
    this.isTyping = false;
  }
}

export enum UserStatus {
  AFK,
  BUSY,
  ONLINE,
  OFFLINE
}
