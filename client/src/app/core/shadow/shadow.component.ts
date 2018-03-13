import { Component, OnInit } from '@angular/core';
import { ShadowService } from './shadow.service';

@Component({
  selector: 'app-shadow',
  template: `<div class="shadow" [ngClass]="{ 'hidden': !visible }"></div>`
})

export class ShadowComponent implements OnInit {
  visible = false;
  constructor(private shadow: ShadowService) { }

  ngOnInit() {
    this.shadow.onShadowVisibilityChanged.subscribe(v => this.visible = v);
  }
}
