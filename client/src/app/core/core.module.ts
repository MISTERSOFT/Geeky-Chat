import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig  } from 'ng-socket-io';
import { WebSocketService } from './websocket.service';

const config: SocketIoConfig = {
  url: 'http://localhost:3000',
  options: {}
}

@NgModule({
  imports: [
    SocketIoModule.forRoot(config)
  ],
  declarations: [],
  providers: [
    WebSocketService
  ]
})
export class CoreModule { }
