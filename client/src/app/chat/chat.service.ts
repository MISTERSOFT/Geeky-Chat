// import { WebSocketService } from './../core/websocket.service';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { AuthService } from '../core/auth.service';
import { ChatStateChangeMultiple, ChatStateChangeSingle, Message, MessageSent, Response, Room, RoomState, User, UserStatus } from '../shared/models';
import { environment } from './../../environments/environment';

@Injectable()
export class ChatService extends Socket implements OnDestroy {
  private rooms: Room[] = [];
  currentRoom: Room;
  onRoomsChanged = new Subject<Room[]>();
  onCurrentRoomChanged = new Subject<Room>();
  showMenu = new Subject<boolean>();

  constructor(private auth: AuthService, private router: Router) {
    super(environment.socketConfig);
  }
  // loadData(): Observable<Response<Room[]>> {
  //   this.emit('FETCH_ALL_USER_DATA', this.auth.getUser().id);
  //   return this.waitResponse('FETCH_ALL_USER_DATA_RESPONSE');
  // }

  ngOnDestroy() {
    console.log('ChatService destroyed');
  }

  sendMessage(message: MessageSent): void {
    this.emit('SEND_MESSAGE', message);
    // return this.fromEvent('SEND_MESSAGE_RESPONSE');
  }

  listenChatState() {
    this.on('CHAT_STATE', (response: Response<RoomState|RoomState[]>) => {
      console.log('Chat state', response);
      if (response.success) {
        if (Array.isArray(response.data)) {
          response.data.forEach(roomState => {
            this.rooms.find(r => r.id === roomState.roomId).users.forEach(roomUser => {
              const userState = roomState.users.find(u => u.userId === roomUser.id);
              if (userState) {
                roomUser.status = userState.status;
              }
            })
          })
        } else {
          const roomState = response.data;
          this.rooms.find(r => r.id === roomState.roomId).users.forEach(roomUser => {
            const userState = roomState.users.find(u => u.userId === roomUser.id);
            if (userState) {
              roomUser.status = userState.status;
            }
          })
        }
      }
    })
  }

  emitChatState(changes: ChatStateChangeSingle|ChatStateChangeMultiple) {
    this.emit('CHAT_STATE_CHANGE', changes);
  }

  debug() {
    this.emit('DEBUG', ['3038c03c9ba32116a19b9374560156d0']);
  }

  pushMessageInCurrentRoom(message: Message) {
    this.currentRoom.messages.push(message);
  }

  listenEmittedMessages(): Observable<Response<Message>> {
    return this.fromEvent('BROADCAST_SEND_MESSAGE');
    // .pipe(
    //   map((response: Response<Message>) => {
    //     console.log('response broadcast', response);
    //     return response.success ? response.data : null;
    //   })
    // );
  }

  createRoom(roomName: string, userId: string) {
    this.emit('CREATE_ROOM', { roomName, userId }, (response: Response<Room>) => {
      this.rooms.push(response.data);
      this.onRoomsChanged.next(this.rooms);
      this.currentRoom = response.data;
      this.onCurrentRoomChanged.next(response.data);
    });
    // const sub = this.waitResponse('CREATE_ROOM_RESPONSE')
    //   .subscribe((response: Response<Room>) => {
    //     this.rooms.push(response.data);
    //     this.onRoomsChanged.next(this.rooms);
    //     this.currentRoom = response.data;
    //     this.onCurrentRoomChanged.next(response.data);
    //     sub.unsubscribe();
    //   });
  }
  generateJoinToken(roomId: string, handleResponse: Function) { // : Observable<Response<JoinToken>> {
    this.emit('GENERATE_JOIN_CODE', roomId, handleResponse);
    // return this.waitResponse('GENERATE_JOIN_CODE_RESPONSE');
  }
  joinRoom(data: { userId: string, token: string }) {
    this.emit('JOIN_ROOM', data, (response: Response<Room>) => {
      console.log('join room res', response);
      if (!response.success) {
        console.log('JOINROOM(): ' + response.errors.join(' | '));
        return;
      }
      this.rooms.push(response.data);
      this.onRoomsChanged.next(this.rooms);
      this.currentRoom = response.data;
      this.onCurrentRoomChanged.next(response.data);

      this.loadRoomUsers(this.currentRoom.id);
      this.loadRoomMessages(this.currentRoom.id);
    });
    // return this.waitResponse('JOIN_ROOM_RESPONSE')
    //   .pipe(
    //     tap((response: Response<Room>) => {
    //       console.log('join room res', response);
    //       if (response.success) {
    //         this.rooms.push(response.data);
    //         this.onRoomsChanged.next(this.rooms);
    //         this.currentRoom = response.data;
    //         this.onCurrentRoomChanged.next(response.data);
    //       } else {
    //         // TODO: Display alert for error
    //         console.log('JOINROOM(): ' + response.errors.join(' | '));
    //       }
    //       return response.success ? response : null
    //     })
    //   )
    //   .flatMap(() => {
    //     return forkJoin(
    //       this.loadRoomUsers(this.currentRoom.id)
    //         .map((response: Response<User[]>) => {
    //           console.log('joined room users', response)
    //           if (response.success) {
    //             this.currentRoom.users = response.data;
    //             return response.data;
    //           } else {
    //             console.log('ERROR, loadRoomUsers() impossible');
    //           }
    //         }),
    //       this.loadRoomMessages(this.currentRoom.id)
    //         .map((response: Response<Message[]>) => {
    //           if (response.success) {
    //             // Sort all message by date asc
    //             response.data.sort((a, b) => {
    //               const msgA = new Date(a.created_at).getTime();
    //               const msgB = new Date(b.created_at).getTime();
    //               return (msgA === msgB) ? 0 : (msgA < msgB) ? -1 : 1;
    //             });
    //             console.log('room message', response.data);
    //             this.currentRoom.messages = response.data;
    //             return response.data;
    //           } else {
    //             console.log('ERROR, loadRoomMessages() impossible')
    //           }
    //         })
    //     )
    //   })
  }
  // Response<Room[]>
  loadUserRooms() { // Observable<any>
    // ! TODO: Remake back to fetch user data
    this.emit('FETCH_USER_ROOMS', this.auth.user.id, (response: Response<Room[]>) => {
      console.log('loading users rooms...');
      if (!response.success) {
        // TODO: Display error
        return;
      }
      this.rooms = response.data;
      if (this.rooms.length > 0) {
        this.currentRoom = this.rooms[0];
        this.onCurrentRoomChanged.next(this.rooms[0]);
      }
      this.onRoomsChanged.next(this.rooms);

      this.loadRoomUsers(this.currentRoom.id);
      this.loadRoomMessages(this.currentRoom.id);
    });
    // return this.waitResponse('FETCH_USER_ROOMS_RESPONSE')
    //   .pipe(
    //     tap((response: Response<Room[]>) => {
    //       if (response.success) {
    //         console.log('User rooms fetched');
    //         this.rooms = response.data;
    //         if (this.rooms.length > 0) {
    //           this.currentRoom = this.rooms[0];
    //           this.onCurrentRoomChanged.next(this.rooms[0]);
    //         }
    //         this.onRoomsChanged.next(this.rooms);
    //       }
    //       return response.success ? response : null;
    //     })
    //   )
    //   .flatMap(() => {
    //     if (!this.currentRoom) {
    //       return Observable.of([]);
    //     }
    //     return forkJoin(
    //       this.loadRoomUsers(this.currentRoom.id)
    //         .map((response: Response<User[]>) => {
    //           console.log('room users', response)
    //           if (response.success) {
    //             this.currentRoom.users = response.data;
    //             return response.data;
    //           } else {
    //             console.log('ERROR, loadRoomUsers() impossible');
    //           }
    //         }),
    //       this.loadRoomMessages(this.currentRoom.id)
    //         .map((response: Response<Message[]>) => {
    //           if (response.success) {
    //             // Sort all message by date asc
    //             response.data.sort((a, b) => {
    //               const msgA = new Date(a.created_at).getTime();
    //               const msgB = new Date(b.created_at).getTime();
    //               return (msgA === msgB) ? 0 : (msgA < msgB) ? -1 : 1;
    //             });
    //             console.log('room message', response.data);
    //             this.currentRoom.messages = response.data;
    //             return response.data;
    //           } else {
    //             console.log('ERROR, loadRoomMessages() impossible')
    //           }
    //         })
    //     )
    //   });
  }
  loadRoomUsers(roomId: string) {
    // ! TODO: Remake back to fetch user data
    this.emit('FETCH_ROOM_USERS', roomId, (response: Response<User[]>) => {
      console.log('room users', response)
      if (response.success) {
        this.currentRoom.users = response.data;
        // return response.data;
      } else {
        // TODO: Display error
        console.log('ERROR, loadRoomUsers() impossible');
      }
    });
    // return this.waitResponse('FETCH_ROOM_USERS_RESPONSE');
  }
  loadRoomMessages(roomId: string) {
    // ! TODO: Remake back to fetch user data
    this.emit('FETCH_ROOM_MESSAGES', roomId, (response: Response<Message[]>) => {
      if (response.success) {
        // Sort all message by date asc
        response.data.sort((a, b) => {
          const msgA = new Date(a.created_at).getTime();
          const msgB = new Date(b.created_at).getTime();
          return (msgA === msgB) ? 0 : (msgA < msgB) ? -1 : 1;
        });
        console.log('room message', response.data);
        this.currentRoom.messages = response.data;
        // return response.data;
      } else {
        // TODO: Display error
        console.log('ERROR, loadRoomMessages() impossible')
      }
    });
    // return this.waitResponse('FETCH_ROOM_MESSAGES_RESPONSE');
  }
  private loadUsersAndMessages() {
    // TODO: For refactor flatMap method
  }
  changeRoom(roomId: string) {
    const room = this.rooms.find(r => r.id === roomId);
    this.currentRoom = room;
    this.onCurrentRoomChanged.next(room);
  }
  listenBroadcastedMessages() : Observable<Message> {
    return this.fromEvent('BROADCAST_SEND_MESSAGE')
      .pipe(
        map((response: Response<Message>) => response.success ? response.data : null)
      );
  }
  listenJoiningUser() {
    this.fromEvent('USER_JOINING').subscribe((response: Response<{ roomId: string, user: User }>) => {
      if (response.success) {
        console.log('joining user res', response);
        const data = response.data;
        // TODO: Make animation to notify user about the joining user
        this.rooms.find(r => r.id === data.roomId).users.push(data.user);
      }
    })
  }

  loadServerInfo() {
    this.emit('DEBUG', null, (data) => {
      console.log('DEBUG:', data);
    });
    // this.waitResponse('DEBUG_RESPONSE').subscribe(console.log)
  }

  load() {
    this.listenChatState();

    this.emit('FETCH_USER_ROOMS_V2', this.auth.user.id, (response: Response<Room[]>) => {
      if (!response.success) {
        // TODO: Display error
        return;
      }
      this.rooms = response.data;
      this.onRoomsChanged.next(this.rooms);
      if (this.rooms.length > 0) {
        this.currentRoom = this.rooms[0];
        this.onCurrentRoomChanged.next(this.rooms[0]);
      }

      this.emitChatState({
        roomIds: this.rooms.map(r => r.id),
        userId: this.auth.user.id,
        status: UserStatus.ONLINE,
        isTyping: false
      });
    });
  }

  disconnect() {
    this.emitChatState({
      roomIds: this.rooms.map(r => r.id),
      userId: this.auth.user.id,
      status: UserStatus.OFFLINE,
      isTyping: false
    });
    super.disconnect();
  }
}
