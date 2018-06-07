import { Component, OnInit } from '@angular/core';
import { PopupBaseComponent } from '@shared/popup/popup-base.component';

@Component({
  selector: 'app-options-popup',
  templateUrl: 'options-popup.component.html'
})

export class OptionsPopupComponent extends PopupBaseComponent implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() { }

  onClosed() {
    super.close();
  }
}
