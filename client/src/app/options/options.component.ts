import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CoreService } from '../core/core.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit, OnDestroy {
  constructor(
    private location: Location,
    private core: CoreService) { }

  ngOnInit() {
    this.core.showMenu.next(false);
  }
  ngOnDestroy() {
    this.core.showMenu.next(true);
  }
  back() {
    this.location.back();
  }
}
