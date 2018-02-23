import { Socket } from 'ng-socket-io';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class WebSocketService extends Socket {
  constructor() {
    super(environment.socketConfig);
  }

  protected waitResponse(eventName: string) {
    return this.fromEvent(eventName);
  }
}
