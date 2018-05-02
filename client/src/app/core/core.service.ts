import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { Observable } from 'rxjs/Observable';
import { Response, Room, JoinToken, User, Message } from '../shared/models';
import { Subject } from 'rxjs/Subject';
import { tap, flatMap, map } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Socket } from 'ng-socket-io';

@Injectable()
export class CoreService extends WebSocketService {
  private rooms: Room[] = [];
  currentRoom: Room;
  onRoomsChanged = new Subject<Room[]>();
  onCurrentRoomChanged = new Subject<Room>();
  constructor(private auth: AuthService) {
    super();
    this.onRoomsChanged.next(null);
    this.onCurrentRoomChanged.next(null);
  }
  createRoom(roomName: string, userId: string) {
    this.emit('CREATE_ROOM', { roomName, userId });
    const sub = this.waitResponse('CREATE_ROOM_RESPONSE')
      .subscribe((response: Response<Room>) => {
        this.rooms.push(response.data);
        this.onRoomsChanged.next(this.rooms);
        this.currentRoom = response.data;
        this.onCurrentRoomChanged.next(response.data);
        sub.unsubscribe();
      });
  }
  generateJoinToken(roomId: string): Observable<Response<JoinToken>> {
    this.emit('GENERATE_JOIN_CODE', roomId);
    return this.waitResponse('GENERATE_JOIN_CODE_RESPONSE');
  }
  joinRoom(data: { userId: string, token: string }) {
    this.emit('JOIN_ROOM', data);
    return this.waitResponse('JOIN_ROOM_RESPONSE')
      .pipe(
        tap((response: Response<Room>) => {
          console.log('join room res', response);
          if (response.success) {
            this.rooms.push(response.data);
            this.onRoomsChanged.next(this.rooms);
            this.currentRoom = response.data;
            this.onCurrentRoomChanged.next(response.data);
          } else {
            // TODO: Display alert for error
            console.log('JOINROOM(): ' + response.errors.join(' | '));
          }
          return response.success ? response : null
        })
      )
      .flatMap(() => {
        return forkJoin(
          this.loadRoomUsers(this.currentRoom.id)
            .map((response: Response<User[]>) => {
              console.log('joined room users', response)
              if (response.success) {
                this.currentRoom.users = response.data;
                return response.data;
              } else {
                console.log('ERROR, loadRoomUsers() impossible');
              }
            }),
          this.loadRoomMessages(this.currentRoom.id)
            .map((response: Response<Message[]>) => {
              if (response.success) {
                // Sort all message by date asc
                response.data.sort((a, b) => {
                  const msgA = new Date(a.created_at).getTime();
                  const msgB = new Date(b.created_at).getTime();
                  return (msgA === msgB) ? 0 : (msgA < msgB) ? -1 : 1;
                });
                console.log('room message', response.data);
                this.currentRoom.messages = response.data;
                return response.data;
              } else {
                console.log('ERROR, loadRoomMessages() impossible')
              }
            })
        )
      })
  }
  // Response<Room[]>
  loadUserRooms(): Observable<any> {
    this.emit('FETCH_USER_ROOMS', this.auth.getUser().id);
    return this.waitResponse('FETCH_USER_ROOMS_RESPONSE')
      .pipe(
        tap((response: Response<Room[]>) => {
          if (response.success) {
            this.rooms = response.data;
            if (this.rooms.length > 0) {
              this.currentRoom = this.rooms[0];
              this.onCurrentRoomChanged.next(this.rooms[0]);
            }
            this.onRoomsChanged.next(this.rooms);
          }
          return response.success ? response : null;
        })
      )
      .flatMap(() => {
        if (!this.currentRoom) {
          return Observable.of([]);
        }
        return forkJoin(
          this.loadRoomUsers(this.currentRoom.id)
            .map((response: Response<User[]>) => {
              console.log('room users', response)
              if (response.success) {
                this.currentRoom.users = response.data;
                return response.data;
              } else {
                console.log('ERROR, loadRoomUsers() impossible');
              }
            }),
          this.loadRoomMessages(this.currentRoom.id)
            .map((response: Response<Message[]>) => {
              if (response.success) {
                // Sort all message by date asc
                response.data.sort((a, b) => {
                  const msgA = new Date(a.created_at).getTime();
                  const msgB = new Date(b.created_at).getTime();
                  return (msgA === msgB) ? 0 : (msgA < msgB) ? -1 : 1;
                });
                console.log('room message', response.data);
                this.currentRoom.messages = response.data;
                return response.data;
              } else {
                console.log('ERROR, loadRoomMessages() impossible')
              }
            })
        )
      })
  }
  loadRoomUsers(roomId: string) {
    this.emit('FETCH_ROOM_USERS', roomId);
    return this.waitResponse('FETCH_ROOM_USERS_RESPONSE');
  }
  loadRoomMessages(roomId: string) {
    this.emit('FETCH_ROOM_MESSAGES', roomId);
    return this.waitResponse('FETCH_ROOM_MESSAGES_RESPONSE');
  }
  private loadUsersAndMessages() {
    // TODO: For refactor flatMap method
  }
  changeRoom(room: Room) {
    this.currentRoom = room;
    this.onCurrentRoomChanged.next(room);
  }
  listenBroadcastedMessages(): Observable<Message> {
    return this.waitResponse('BROADCAST_SEND_MESSAGE')
      .pipe(
        map((response: Response<Message>) => {
          console.log('response broadcast', response);
          return response.success ? response.data : null;
        })
      );
  }
  listenJoiningUser() {
    return this.waitResponse('USER_JOINING').subscribe((response: Response<{ roomId: string, user: User }>) => {
      if (response.success) {
        console.log('joining user res', response);
        const data = response.data;
        // TODO: Make animation to notify user about the joining user
        this.rooms.find(r => r.id === data.roomId).users.push(data.user);
      }
    })
  }

  loadServerInfo() {
    this.emit('DEBUG');
    this.waitResponse('DEBUG_RESPONSE').subscribe(console.log)
  }
}
