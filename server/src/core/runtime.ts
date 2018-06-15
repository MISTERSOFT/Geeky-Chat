
export class RuntimeChatState {
  rooms: RuntimeRoomState[];
  constructor() {
    this.rooms = [];
  }

  getRoomsStates(roomIds: string[]): RuntimeRoomState[] {
    const states: RuntimeRoomState[] = []
    roomIds.forEach(roomId => {
      states.push(Object.assign({}, this.rooms.find(r => r.roomId === roomId)))
    })
    return states
  }

  getRoomsStateByUser(roomIds: string[], userId: string): RuntimeRoomState[] {
    const states: RuntimeRoomState[] = []
    roomIds.forEach(roomId => {
      states.push(Object.assign({}, this.rooms.find(r => r.roomId === roomId)))
    })
    states.forEach(state => {
      state.users = state.users.filter(u => u.userId === userId)
    })
    return states
  }

  getRoomStateByUser(roomId: string, userId: string): RuntimeRoomState {
    const state = Object.assign({}, this.rooms.find(r => r.roomId === roomId))
    state.users = state.users.filter(u => u.userId !== userId)
    return state
  }

  applyChanges(changes: ChatStateChangeSingle|ChatStateChangeMultiple) {
    if (ChatStateChangeMultiple.isInstance(changes)) {
      changes.roomIds.forEach(roomId => {
        const user = this.rooms.find(r => r.roomId === roomId).users.find(u => u.userId === changes.userId)
        user.status = changes.status
        user.isTyping = changes.isTyping
      })
    } else {
      const user = this.rooms.find(r => r.roomId === changes.roomId).users.find(u => u.userId === changes.userId)
      user.status = changes.status
      user.isTyping = changes.isTyping
    }
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

export interface ChatStateChange {
  userId: string;
  status: UserStatus;
  isTyping: boolean;
}

/**
 * Event that describe changes ona single room for a given user
 */
export class ChatStateChangeSingle implements ChatStateChange {
  userId: string;
  status: UserStatus;
  isTyping: boolean;
  roomId: string;
  static isInstance(obj): obj is ChatStateChangeSingle {
    return 'roomId' in obj;
  }
}

/**
 * Event that describe changes on multiple rooms for a given user
 */
export class ChatStateChangeMultiple implements ChatStateChange {
  userId: string;
  status: UserStatus;
  isTyping: boolean;
  roomIds: string[];
  static isInstance(obj): obj is ChatStateChangeMultiple {
    return 'roomIds' in obj;
  }
}
