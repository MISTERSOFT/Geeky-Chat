import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from '../core/core.service';
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
  room: Room;
  text: string; // Message to send

  // private _subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private chat: ChatService,
    private core: CoreService,
    private auth: AuthService) { }

  ngOnInit() {
    // Data not loaded already
    // We are in: /chat
    if (this.route.snapshot.url.length === 0) {
      this.core.loadUserRooms(); // .subscribe();
      this.core.onCurrentRoomChanged.subscribe(room => {
        if (room) {
          this.router.navigate(['chat', room.id]);
        }
      });
    } else {
      // Data loaded
      // We are in: /chat/:id
      this.route.params.subscribe(params => {
        this.core.onCurrentRoomChanged.subscribe(room => {
          this.room = room;
        });
        this.core.changeRoom(params['id']);
      });
      this.core.listenBroadcastedMessages().subscribe((message) => {
        if (message) {
          this.room.messages.push(message);
        }
      });
      this.core.listenJoiningUser();
    }
  }

  ngOnDestroy() {
    // this._subscriptions.forEach(sub => sub.unsubscribe());
  }

  onMessageSent(message) {
    this.room.messages.push(message);
  }

}
