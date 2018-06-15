import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import "rxjs/add/operator/takeWhile";
import { Room } from '../shared/models';
import { AuthService } from './../core/auth.service';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  // messages: Message[];
  // @ViewChild('messagesContainer') $messagesContainer: ElementRef;
  room: Room;
  text: string; // Message to send
  fromBottom: string;
  /**
   * Is component will be destroyed
   */
  private _destroy = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private chat: ChatService,
    private auth: AuthService) { }

  ngOnInit() {
    // Data not loaded already
    // We are in: /r
    // if (this.route.snapshot.url.length === 0) {
    //   // this.chat.loadUserRooms(); // .subscribe();
    //   this.chat.load();
    //   this.chat.onCurrentRoomChanged.subscribe(room => {
    //     if (room) {
    //       this.router.navigate(['chat', room.id]);
    //     }
    //   });
    // } else {
    //   // Data loaded
    //   // We are in: /r/:id
    //   this.route.params.subscribe(params => {
    //     this.chat.onCurrentRoomChanged.subscribe(room => {
    //       this.room = room;
    //     });
    //     this.chat.changeRoom(params['id']);
    //   });
    //   this.chat.listenBroadcastedMessages().subscribe((message) => {
    //     if (message) {
    //       this.room.messages.push(message);
    //     }
    //   });
    //   this.chat.listenJoiningUser();
    // }

    // Connect socket if necessary
    if (this.chat.ioSocket.disconnected) {
      this.chat.connect();
    }
    this.chat.load();
    this.chat.onCurrentRoomChanged.takeWhile(() => !this._destroy).subscribe(room => {
      this.room = room;
    });
    this.chat.listenBroadcastedMessages().takeWhile(() => !this._destroy).subscribe((message) => {
      if (message) {
        this.room.messages.push(message);
      }
    });
    this.chat.listenJoiningUser();

    this.chat.on('error', (err) => {
      console.log('unauthorized', err);
    });
  }

  ngOnDestroy() {
    this._destroy = true;
    this.chat.removeListener('error');
    this.chat.removeListener('CHAT_STATE');
    this.chat.removeListener('CHAT_STATE_CHANGE');
  }

  onMessageSent(message) {
    this.room.messages.push(message);
  }

  onInputHeightChange(height) {
    this.fromBottom = height;
  }
}
