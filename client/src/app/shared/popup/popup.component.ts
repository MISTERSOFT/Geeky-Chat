import { Component, OnInit, HostListener, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: 'popup.component.html',
  styleUrls: ['popup.component.scss']
})

export class PopupComponent implements OnInit {
  @Output() clickOutside = new EventEmitter<boolean>();
  constructor() { }
  ngOnInit() { }
  onClickOutside() {
    this.clickOutside.next(true);
  }
  onPopupContainerClick(e: MouseEvent) {
    e.stopPropagation();
  }
}
