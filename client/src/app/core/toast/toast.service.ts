import { Injectable, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ToastData } from './toast.model';
import { ToastComponent } from './toast.component';

@Injectable()
export class ToastService {
  /**
   * Use to push new toast
   */
  push$ = new Subject<ToastData>();
}
