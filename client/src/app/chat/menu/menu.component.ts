import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/index';
import { Room, User, UserStatus } from '@shared/models';
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
  showOptionsPopup = false;
  private _destroy = false;
  constructor(
    private router: Router,
    private chat: ChatService,
    private auth: AuthService) { }

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

    this.chat.on('disconnect', this.onDisconnect.bind(this));
  }

  ngOnDestroy() {
    this._destroy = true;
    this.chat.removeListener('disconnect');
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
  }

  openRoomPopup() {
    this.showRoomPopup = true;
  }

  openInvitationPopup() {
    this.showInvitationPopup = true;
  }

  openOptionsPopup() {
    this.showOptionsPopup = true;
  }

  isCurrentRoom(room: Room) {
    return room.id === this.currentRoom.id;
  }

  onSelectRoom(roomId) {
    // this.core.onCurrentRoomChanged.next(room);
    this.chat.changeRoom(roomId);
    // this.router.navigate(['chat', roomId]);
  }

  getClassForUserStatus(status: UserStatus) {
    switch (status) {
      case UserStatus.OFFLINE: return 'offline';
      case UserStatus.AFK: return 'afk';
      case UserStatus.BUSY: return 'busy';
      case UserStatus.ONLINE: return 'online';
      default: return 'offline';
    }
  }

  debug() {
    // this.core.loadServerInfo();
    this.chat.debug();
  }

  disconnect() {
    this.chat.disconnect();
  }

  onDisconnect() {
    console.log('User disconnected...');
    this.auth.clear();
    this.router.navigate(['signin']);
  }
}
