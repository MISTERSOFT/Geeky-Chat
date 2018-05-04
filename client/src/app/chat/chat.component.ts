import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';
import { MessageSent, Message, Room } from '../shared/models';
import { AuthService } from './../core/auth.service';
import { CoreService } from '../core/core.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  // messages: Message[];
  room: Room;
  text: string; // Message to send

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
      this.core.loadUserRooms().subscribe();
      this.core.onCurrentRoomChanged.subscribe(room => this.router.navigate(['chat', room.id]));
    } else {
      // Data loaded
      // We are in: /chat/:id
      this.route.params.subscribe(params => {
        this.core.onCurrentRoomChanged.subscribe(room => this.room = room);
        this.core.changeRoom(params['id']);
      });
    }
    this.core.listenBroadcastedMessages().subscribe((message) => {
      if (message) {
        this.room.messages.push(message);
      }
    });
    this.core.listenJoiningUser();
  }

  onMessageSent(message) {
    this.room.messages.push(message);
  }

}
