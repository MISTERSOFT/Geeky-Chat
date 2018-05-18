import { Injectable, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ToastData } from './toast.model';
import { ToastComponent } from './toast.component';

@Injectable()
export class ToastService {
  constructor(private cfr: ComponentFactoryResolver) { }
  createToast(viewContainerRef: ViewContainerRef, data: ToastData) {
    const componentFactory = this.cfr.resolveComponentFactory(ToastComponent);
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<ToastComponent>componentRef.instance).data = data;
    setTimeout(() => {
      viewContainerRef.clear();
    }, data.duration);
  }
}
