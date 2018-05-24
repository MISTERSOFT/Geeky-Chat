import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { ToastComponent } from './toast.component';
import { ToastDirective } from './toast.directive';
import { ToastData } from './toast.model';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast-container',
  template: `
  <div class="toast-container">
    <ng-template appToast></ng-template>
  </div>
  `,
  styleUrls: ['toast-container.component.scss']
})

export class ToastContainerComponent implements OnInit {
  @ViewChild(ToastDirective) toastContainer: ToastDirective;
  private readonly TOAST_DURATION = 5000;

  constructor(
    private cfr: ComponentFactoryResolver,
    private toast: ToastService) { }

  ngOnInit() {
    this.toast.push$.subscribe(toast => this.create(toast));
  }

  create(data: ToastData) {
    const componentFactory = this.cfr.resolveComponentFactory(ToastComponent);
    const viewContainerRef = this.toastContainer.viewContainerRef;
    // viewContainerRef.clear();
    // viewContainerRef.remove();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<ToastComponent>componentRef.instance).data = data;
    // Auto clear after X time
    const timerId = setTimeout(() => {
      viewContainerRef.remove();
      clearTimeout(timerId);
    }, this.TOAST_DURATION);
  }

}
