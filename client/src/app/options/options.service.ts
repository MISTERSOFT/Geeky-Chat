import { Injectable } from '@angular/core';
import { WebSocketService } from '../core/websocket.service';
import { User } from '../shared/models';

@Injectable()
export class OptionsService extends WebSocketService {
  constructor() {
    super();
  }
  updateProfile(user: User, handleResponse: Function) {
    this.emit('UPDATE_USER', user, handleResponse);
  }
}
