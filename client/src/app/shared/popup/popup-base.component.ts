import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  template: ''
})
/**
 * Base component for modal components.
 *
 * Usage:
 * ``` typescript
 * MyPopupComponent extends PopupBaseComponent
 * ```
 */
export class PopupBaseComponent {
  @Input() visible;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() fullscreen = false;
  protected close() {
    this.visible = false;
    this.visibleChange.next(this.visible);
  }
}
