import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards';
import { AuthService, TranslateService } from '@core/index';
import { ShadowService } from '@core/shadow';
import { SocketIoModule } from 'ng-socket-io';
import { WebStorageModule } from 'ngx-store';
import { LayoutModule } from '../layout/layout.module';
import { MenuComponent } from './menu/menu.component';
import { ShadowComponent } from './shadow/shadow.component';
import { ToastContainerComponent } from './toast/toast-container.component';
import { ToastComponent } from './toast/toast.component';
import { ToastDirective } from './toast/toast.directive';
import { ToastService } from './toast/toast.service';


@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    HttpClientModule,
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
    // RoomPopupComponent,
    // InvitationPopupComponent,
    ShadowComponent,
    ToastContainerComponent,
    ToastComponent,
    ToastDirective
  ],
  providers: [
    // WebSocketService,
    AuthService,
    AuthGuard,
    ShadowService,
    // CoreService,
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
      providers: [] // AuthService, WebSocketService
    }
  }
}
