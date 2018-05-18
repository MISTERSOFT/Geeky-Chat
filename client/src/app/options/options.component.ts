import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { CoreService } from '../core/core.service';
import { ToastDirective } from '../shared/toast/toast.directive';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit, OnDestroy {
  @ViewChild(ToastDirective) toastContainer: ToastDirective;
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
