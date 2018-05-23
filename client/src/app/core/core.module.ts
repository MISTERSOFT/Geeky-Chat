import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SocketIoModule } from 'ng-socket-io';
import { WebStorageModule } from 'ngx-store';

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
import { TranslateService } from './translate.service';
import { ToastContainerComponent } from './toast/toast-container.component';
import { ToastComponent } from './toast/toast.component';
import { ToastDirective } from './toast/toast.directive';
import { ToastService } from './toast/toast.service';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    SocketIoModule,
    FormsModule,
    LayoutModule,
    WebStorageModule
  ],
  exports: [
    MenuComponent,
    ShadowComponent,
    ToastContainerComponent
  ],
  declarations: [
    MenuComponent,
    RoomPopupComponent,
    InvitationPopupComponent,
    ShadowComponent,
    ToastContainerComponent,
    ToastComponent,
    ToastDirective
  ],
  providers: [
    WebSocketService,
    AuthService,
    AuthGuard,
    ShadowService,
    CoreService,
    TranslateService,
    ToastService
  ],
  entryComponents: [
    ToastComponent
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
