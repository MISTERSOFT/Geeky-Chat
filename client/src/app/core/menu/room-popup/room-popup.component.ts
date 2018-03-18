import { ShadowService } from './../../shadow/shadow.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CoreService } from '../../core.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-room-popup',
  templateUrl: 'room-popup.component.html',
  styleUrls: ['room-popup.component.scss']
})

export class RoomPopupComponent implements OnInit {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  roomName: string;
  constructor(
    private core: CoreService,
    private auth: AuthService,
    private shadow: ShadowService) { }
  ngOnInit() { }
  createRoom() {
    this.core.createRoom(this.roomName, this.auth.getUser().id);
    this.visible = false;
    this.visibleChange.next(this.visible);
    this.shadow.onShadowVisibilityChanged.next(false);
  }
}
