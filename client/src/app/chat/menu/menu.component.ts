import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/index';
import { ShadowService } from '@core/shadow';
import { Room, User } from '@shared/models';
import { ChatService } from 'app/chat/chat.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.scss']
})

export class MenuComponent implements OnInit {
  rooms$: Observable<Room[]>;
  currentRoom: Room;
  user: User;
  showMore = false;
  showRoomPopup = false;
  showInvitationPopup = false;

  constructor(
    private router: Router,
    // private core: CoreService,
    private chat: ChatService,
    private auth: AuthService,
    private shadow: ShadowService) { }

  ngOnInit() {
    // this.core.showMenu.subscribe(show => this.showMenu = show);
    this.rooms$ = this.chat.onRoomsChanged; //.subscribe(rooms => {
    //   this.rooms = rooms;
    //   console.log('menu rooms', rooms);
    // });
    this.chat.onCurrentRoomChanged.subscribe(curr => {
      // console.log('Menu: current room changed', curr.id);
      this.currentRoom = curr;
    });
    this.user = this.auth.user;
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
  }

  openRoomPopup() {
    // this.shadow.onShadowVisibilityChanged.next(true);
    this.showRoomPopup = true;
  }

  openInvitationPopup() {
    // this.shadow.onShadowVisibilityChanged.next(true);
    this.showInvitationPopup = true;
  }

  isCurrentRoom(room: Room) {
    return room.id === this.currentRoom.id;
  }

  onSelectRoom(roomId) {
    // this.core.onCurrentRoomChanged.next(room);
    this.chat.changeRoom(roomId);
    // this.router.navigate(['chat', roomId]);
  }

  debug(v) {
    console.log('debug', v);
    // this.core.loadServerInfo();
  }
}
