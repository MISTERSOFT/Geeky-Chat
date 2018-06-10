import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, NoNeedToLoginGuard } from '@core/guards';
import { AuthService, TranslateService } from '@core/index';
import { SocketIoModule } from 'ng-socket-io';
import { WebStorageModule } from 'ngx-store';
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
    WebStorageModule
  ],
  exports: [
    ToastContainerComponent
  ],
  declarations: [
    ToastContainerComponent,
    ToastComponent,
    ToastDirective
  ],
  providers: [
    // Guards
    AuthGuard,
    NoNeedToLoginGuard,
    // Services
    AuthService,
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
      providers: [] // AuthService
    }
  }
}
