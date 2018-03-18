import { Observable } from 'rxjs/Observable';
import { WebSocketService } from './../core/websocket.service';
import { Injectable } from '@angular/core';
import { Message, MessageSent, Response, Room } from '../shared/models';
import { AuthService } from '../core/auth.service';

@Injectable()
export class ChatService extends WebSocketService {
  constructor(private auth: AuthService) {
    super()
  }
  // loadData(): Observable<Response<Room[]>> {
  //   this.emit('FETCH_ALL_USER_DATA', this.auth.getUser().id);
  //   return this.waitResponse('FETCH_ALL_USER_DATA_RESPONSE');
  // }
  sendMessage(message: MessageSent): Observable<Response<Message>> {
    this.emit('SEND_MESSAGE', message);
    return this.waitResponse('SEND_MESSAGE_RESPONSE');
  }
}
