import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { NewUser } from '../shared/models';

@Injectable()
export class WebSocketService {
  constructor(private socket: Socket) { }

  private waitResponse(eventName: string) {
    return this.socket.fromEvent(eventName);
  }

  signup(user: NewUser) {
    this.socket.emit('SIGNUP', user);
    return this.waitResponse('SIGNUP_RESPONSE');
  }
}
