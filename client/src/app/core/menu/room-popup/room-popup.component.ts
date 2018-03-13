import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-room-popup',
  templateUrl: 'room-popup.component.html',
  styleUrls: ['room-popup.component.scss']
})

export class RoomPopupComponent implements OnInit {
  @Input() visible = false;
  constructor() { }

  ngOnInit() { }
}
