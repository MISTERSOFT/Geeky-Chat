import { Component, OnInit, Input } from '@angular/core';
import { CoreService } from '../../core.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-room-popup',
  templateUrl: 'room-popup.component.html',
  styleUrls: ['room-popup.component.scss']
})

export class RoomPopupComponent implements OnInit {
  @Input() visible = false;
  roomName: string;
  constructor(private core: CoreService, private auth: AuthService) { }
  ngOnInit() { }
  createRoom() {
    this.core.createRoom(this.roomName, this.auth.getUser().id).subscribe();
    this.visible = false;
  }
}
