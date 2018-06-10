import { Component, OnInit } from '@angular/core';
import { PopupBaseComponent } from '@shared/popup/popup-base.component';
import { ChatService } from 'app/chat/chat.service';

@Component({
  selector: 'app-invitation-popup',
  templateUrl: 'invitation-popup.component.html',
  styleUrls: ['invitation-popup.component.scss']
})

export class InvitationPopupComponent extends PopupBaseComponent implements OnInit {
  token: string;
  constructor(private chat: ChatService) {
      super();
    }
  ngOnInit() { }
  onClosed() {
    this.close();
  }
  onGenerateCode() {
    const currentRoomId = this.chat.currentRoom.id;
    // const sub =
    this.chat.generateJoinToken(currentRoomId, (response) => this.token = response.data.token);
    // .subscribe(response => {
    //   this.token = response.data.token;
    //   sub.unsubscribe();
    // });
  }
  close() {
    this.token = '';
    super.close();
  }
}
