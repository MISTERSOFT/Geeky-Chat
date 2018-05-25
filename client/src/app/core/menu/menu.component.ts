import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/index';
import { ShadowService } from '@core/shadow';
import { Room, User } from '@shared/models';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.scss']
})

export class MenuComponent implements OnInit {
  rooms: Room[];
  currentRoom: Room;
  user: User;
  showMenu = false;
  showMore = false;
  showRoomPopup = false;
  showInvitationPopup = false;

  constructor(
    private router: Router,
    // private core: CoreService,
    private auth: AuthService,
    private shadow: ShadowService) { }

  ngOnInit() {
    // this.core.showMenu.subscribe(show => this.showMenu = show);
    // this.core.onRoomsChanged.subscribe(rooms => {
    //   this.rooms = rooms;
    //   console.log('menu rooms', rooms);
    // });
    // this.core.onCurrentRoomChanged.subscribe(curr => {
    //   // console.log('Menu: current room changed', curr.id);
    //   this.currentRoom = curr;
    // });
    this.auth.userObs.subscribe(user => this.user = user);
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

  onSelectRoom(roomId) {
    // this.core.onCurrentRoomChanged.next(room);
    // this.core.changeRoom(room);
    this.router.navigate(['chat', roomId]);
  }

  debug() {
    // this.core.loadServerInfo();
  }
}
