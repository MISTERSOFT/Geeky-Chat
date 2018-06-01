import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: 'popup.component.html',
  styleUrls: ['popup.component.scss']
})

export class PopupComponent implements OnInit {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() title: string;
  @Input() showHeader = true;
  @Input() showFooter = true;
  @Output() onClosed = new EventEmitter<boolean>();
  constructor() { }
  ngOnInit() { }
  // onClickOutside() {
  //   this.clickOutside.next(true);
  // }
  // onPopupContainerClick(e: MouseEvent) {
  //   e.stopPropagation();
  // }
  close() {
    this.visible = false;
    this.visibleChange.next(false);
    this.onClosed.next(true);
  }

  onClickOverlay() {
    this.close();
  }

}
