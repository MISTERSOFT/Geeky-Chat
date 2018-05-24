import { environment } from './../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators'
import { WebSocketService } from './../core/websocket.service';
import { Injectable } from '@angular/core';
import { Message, MessageSent, Response, Room } from '../shared/models';
import { AuthService } from '../core/auth.service';
import { Socket } from 'ng-socket-io';

@Injectable()
export class ChatService extends Socket {
  constructor(private auth: AuthService) {
    super(environment.socketConfig);
  }
  // loadData(): Observable<Response<Room[]>> {
  //   this.emit('FETCH_ALL_USER_DATA', this.auth.getUser().id);
  //   return this.waitResponse('FETCH_ALL_USER_DATA_RESPONSE');
  // }
  sendMessage(message: MessageSent): void {
    this.emit('SEND_MESSAGE', message);
    // return this.waitResponse('SEND_MESSAGE_RESPONSE');
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
}
