import { Observable } from 'rxjs/Observable';
import { WebSocketService } from './../core/websocket.service';
import { Injectable } from '@angular/core';
import { Message, MessageSent, Response } from '../shared/models';

@Injectable()
export class ChatService extends WebSocketService {
  constructor() {
    super()
  }

  getAllMessages(): Observable<Response<Message[]>> {
    this.emit('FETCH_ALL_MESSAGES');
    return this.waitResponse('FETCH_ALL_MESSAGES_RESPONSE');
  }

  sendMessage(message: MessageSent): Observable<Response<Message>> {
    this.emit('SEND_MESSAGE', message);
    return this.waitResponse('SEND_MESSAGE_OK');
  }
}
