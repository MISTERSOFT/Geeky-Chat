import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/index';
import { ShadowService } from '@core/shadow';
import { Room, User } from '@shared/models';
import { ChatService } from 'app/chat/chat.service';

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
  private _destroy = false;
  constructor(
    private router: Router,
    private chat: ChatService,
    private auth: AuthService,
    private shadow: ShadowService) { }

  ngOnInit() {
    this.chat.onRoomsChanged.takeWhile(() => !this._destroy).subscribe(rooms => {
      this.rooms = rooms;
      console.log('menu rooms', rooms);
    });
    this.chat.onCurrentRoomChanged.takeWhile(() => !this._destroy).subscribe(curr => {
      // console.log('Menu: current room changed', curr.id);
      this.currentRoom = curr;
    });
    this.user = this.auth.user;

    this.chat.on('disconnect', () => {
      console.log('User disconnected...');
      this.auth.clear();
      this.router.navigate(['signin']);
    });
  }

  ngOnDestroy() {
    this._destroy = true;
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

  disconnect() {
    this.chat.disconnect();
  }
}
