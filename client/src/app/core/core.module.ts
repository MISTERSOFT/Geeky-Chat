import { NgModule, ModuleWithProviders } from '@angular/core';
import { SocketIoModule } from 'ng-socket-io';
import { WebSocketService } from './websocket.service';
import { AuthService } from './auth.service';

@NgModule({
  imports: [
    SocketIoModule
  ],
  declarations: [],
  providers: [
    WebSocketService,
    AuthService
  ]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [AuthService, WebSocketService]
    }
  }
}
