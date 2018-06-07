import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: 'popup.component.html',
  styleUrls: ['popup.component.scss']
})

/**
 * Provide a modal. Only the content need to be filled.
 */
export class PopupComponent implements OnInit {
  // @Input() visible = false;
  // @Output() visibleChange = new EventEmitter<boolean>();
  @Input() title: string;
  @Input() showHeader = true;
  @Input() showFooter = true;
  @Output() onClosed = new EventEmitter<boolean>();
  @Input() fullscreen = false;

  constructor() { }

  ngOnInit() { }

  /**
   * Close modal when 'Escape' is pressed
   * @param e {KeyboardEvent}
   */
  @HostListener('window:keydown.escape', ['$event']) private onPressEscape(e: KeyboardEvent) {
    if (this.fullscreen) {
      this.close();
    }
  }

  close() {
    // this.visible = false;
    // this.visibleChange.next(false);
    this.onClosed.next(true);
  }

  onClickOverlay() {
    if (!this.fullscreen) {
      this.close();
    }
  }
}
