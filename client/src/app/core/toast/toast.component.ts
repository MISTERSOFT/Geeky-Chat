import { Component, OnInit, Input } from '@angular/core';
import { ToastData } from './toast.model';

@Component({
  selector: 'app-toast',
  templateUrl: 'toast.component.html',
  styleUrls: ['toast.component.scss']
})

export class ToastComponent implements OnInit {
  @Input() data: ToastData;
  constructor() { }
  ngOnInit() { }
}
