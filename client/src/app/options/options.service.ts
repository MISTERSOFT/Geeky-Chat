import { Injectable } from '@angular/core';
import { User } from '../shared/models';
import { WebSocketService } from '../core/websocket.service';

@Injectable()
export class OptionsService extends WebSocketService {
  constructor() {
    super();
  }
  updateProfile(user: User) {
    console.log('updateProfile');
    this.emit('UPDATE_USER', user);
    return this.waitResponse('UPDATE_USER_RESPONSE');
  }
}
