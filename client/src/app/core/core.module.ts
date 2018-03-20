import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocketIoModule } from 'ng-socket-io';

import { WebSocketService } from './websocket.service';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards';
import { MenuComponent } from './menu/menu.component';
import { RoomPopupComponent } from './menu/room-popup/room-popup.component';
import { ShadowService } from './shadow/shadow.service';
import { ShadowComponent } from './shadow/shadow.component';
import { CoreService } from './core.service';
import { InvitationPopupComponent } from './menu/invitation-popup/invitation-popup.component';
import { LayoutModule } from '../layout/layout.module';

@NgModule({
  imports: [
    CommonModule,
    SocketIoModule,
    FormsModule,
    LayoutModule
  ],
  exports: [
    MenuComponent,
    ShadowComponent
  ],
  declarations: [
    MenuComponent,
    RoomPopupComponent,
    InvitationPopupComponent,
    ShadowComponent
  ],
  providers: [
    WebSocketService,
    AuthService,
    AuthGuard,
    ShadowService,
    CoreService
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
