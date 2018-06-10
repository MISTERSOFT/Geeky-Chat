import { Component, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '@core/index';
import { PopupBaseComponent } from '@shared/popup/popup-base.component';
import { ChatService } from 'app/chat/chat.service';

@Component({
  selector: 'app-room-popup',
  templateUrl: 'room-popup.component.html',
  styleUrls: ['room-popup.component.scss']
})
export class RoomPopupComponent extends PopupBaseComponent implements OnInit {
  roomName: string;
  joinToken: string;
  constructor(
    private renderer: Renderer2,
    private auth: AuthService,
    private chat: ChatService) {
      super();
    }
  ngOnInit() { }
  onClosed() {
    this.close();
  }
  createRoom() {
    this.chat.createRoom(this.roomName, this.auth.user.id);
    this.close();
  }
  joinRoom() {
    this.chat.joinRoom({userId: this.auth.user.id, token: this.joinToken});
  }

  private reset() {
    this.roomName = '';
    this.joinToken = '';
  }

  close() {
    this.reset();
    super.close();
  }
}
