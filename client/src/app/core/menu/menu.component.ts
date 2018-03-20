import { Component, OnInit } from '@angular/core';
import { User, Room } from '../../shared/models';
import { AuthService } from '../auth.service';
import { ShadowService } from '../shadow/shadow.service';
import { CoreService } from '../core.service';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.scss']
})

export class MenuComponent implements OnInit {
  rooms: Room[];
  currentRoom: Room;
  user: User;
  showMore = false;
  showRoomPopup = false;
  showInvitationPopup = false;

  constructor(
    private core: CoreService,
    private auth: AuthService,
    private shadow: ShadowService) { }

  ngOnInit() {
    this.core.onRoomsChanged.subscribe(rooms => {
      this.rooms = rooms;
      console.log('menu rooms', rooms);
    });
    this.core.onCurrentRoomChanged.subscribe(curr => this.currentRoom = curr);
    this.user = this.auth.getUser();
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
  }

  openRoomPopup() {
    this.shadow.onShadowVisibilityChanged.next(true);
    this.showRoomPopup = true;
  }

  openInvitationPopup() {
    this.shadow.onShadowVisibilityChanged.next(true);
    this.showInvitationPopup = true;
  }

  isCurrentRoom(room: Room) {
    return room.id === this.currentRoom.id;
  }

  onSelectRoom(room) {
    this.core.onCurrentRoomChanged.next(room);
  }
}
