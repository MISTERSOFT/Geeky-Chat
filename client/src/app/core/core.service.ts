import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { Observable } from 'rxjs/Observable';
import { Response, Room } from '../shared/models';
import { Subject } from 'rxjs/Subject';
import { tap } from 'rxjs/operators'
import { Socket } from 'ng-socket-io';

@Injectable()
export class CoreService extends WebSocketService {
  private rooms: Room[];
  onRoomsChanged = new Subject<Room[]>();
  onCurrentRoomChanged = new Subject<Room>();
  constructor(private auth: AuthService) {
    super();
    this.onRoomsChanged.next(null);
    this.onCurrentRoomChanged.next(null);
  }
  createRoom(roomName: string, userId: string) {
    this.emit('CREATE_ROOM', { roomName, userId });
    const sub = this.waitResponse('CREATE_ROOM_RESPONSE').subscribe((response: Response<Room>) => {
      this.rooms.push(response.data);
      this.onRoomsChanged.next(this.rooms);
      this.onCurrentRoomChanged.next(response.data);
      sub.unsubscribe();
    });
  }
  joinRoom(roomName: string, userId: string) {
    this.emit('JOIN_ROOM', { roomName, userId });
    const sub = this.waitResponse('JOIN_ROOM_RESPONSE').subscribe((response: Response<Room>) => {
      this.rooms.push(response.data);
      this.onRoomsChanged.next(this.rooms);
      this.onCurrentRoomChanged.next(response.data);
      sub.unsubscribe();
    });
  }
  loadData(): Observable<Response<Room[]>> {
    this.emit('FETCH_ALL_USER_DATA', this.auth.getUser().id);
    return this.waitResponse('FETCH_ALL_USER_DATA_RESPONSE').pipe(
      tap((response: Response<Room[]>) => {
        if (response.success) {
          this.rooms = response.data;
          this.rooms.map(room => {
            // Sort all message by date asc
            room.messages.sort((a, b) => {
              const msgA = new Date(a.createdAt).getTime();
              const msgB = new Date(b.createdAt).getTime();
              return (msgA === msgB) ? 0 : (msgA < msgB) ? -1 : 1;
            });
            return room;
          });
          if (this.rooms.length > 0) {
            this.onCurrentRoomChanged.next(this.rooms[0]);
          }
          this.onRoomsChanged.next(this.rooms);
        }
      })
    );
  }
}
