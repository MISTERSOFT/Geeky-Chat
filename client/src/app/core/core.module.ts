import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketIoModule } from 'ng-socket-io';
import { WebSocketService } from './websocket.service';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  imports: [
    CommonModule,
    SocketIoModule
  ],
  exports: [
    MenuComponent
  ],
  declarations: [
    MenuComponent
  ],
  providers: [
    WebSocketService,
    AuthService,
    AuthGuard
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
