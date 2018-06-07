import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, NoNeedToLoginGuard } from '@core/guards';
import { AuthService, TranslateService } from '@core/index';
import { ShadowService } from '@core/shadow';
import { SocketIoModule } from 'ng-socket-io';
import { WebStorageModule } from 'ngx-store';
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
    // FormsModule,
    WebStorageModule
  ],
  exports: [
    ShadowComponent,
    ToastContainerComponent
  ],
  declarations: [
    ShadowComponent,
    ToastContainerComponent,
    ToastComponent,
    ToastDirective
  ],
  providers: [
    // WebSocketService,
    // Guards
    AuthGuard,
    NoNeedToLoginGuard,
    // Services
    AuthService,
    ShadowService,
    // CoreService,
    TranslateService,
    ToastService,
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
