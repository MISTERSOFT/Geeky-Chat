import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketIoModule } from 'ng-socket-io';

import { WebSocketService } from './websocket.service';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards';
import { MenuComponent } from './menu/menu.component';
import { RoomPopupComponent } from './menu/room-popup/room-popup.component';
import { ShadowService } from './shadow/shadow.service';
import { ShadowComponent } from './shadow/shadow.component';

@NgModule({
  imports: [
    CommonModule,
    SocketIoModule
  ],
  exports: [
    MenuComponent,
    ShadowComponent
  ],
  declarations: [
    MenuComponent,
    RoomPopupComponent,
    ShadowComponent
  ],
  providers: [
    WebSocketService,
    AuthService,
    AuthGuard,
    ShadowService
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
