import { Directive, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[appToast]' })
export class ToastDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
