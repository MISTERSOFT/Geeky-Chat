import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class WebSocketService extends Socket {
  constructor() {
    super(environment.socketConfig);
  }

  // protected waitResponse(eventName: string): Observable<any> {
  //   return this.fromEvent(eventName);
  // }
}
