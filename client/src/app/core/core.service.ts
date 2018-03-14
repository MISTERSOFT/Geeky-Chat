import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CoreService extends WebSocketService {
  constructor() {
    super();
  }
  createRoom(roomName: string, userId: string): Observable<any> {
    this.emit('CREATE_ROOM', {roomName, userId});
    return this.waitResponse('CREATE_ROOM_RESPONSE');
  }
}
