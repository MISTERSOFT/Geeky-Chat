import { AuthService } from './../core/auth.service';
import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';
import { MessageSent, Message, Room } from '../shared/models';
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
    private chat: ChatService,
    private core: CoreService,
    private auth: AuthService) { }

  ngOnInit() {
    this.core.loadData().subscribe();
    this.core.onCurrentRoomChanged.subscribe(room => this.room = room);
    // Store message history and sort all message by date asc
    // this.messages = response.data.sort((a, b) => {
    //   const msgA = new Date(a.createdAt).getTime();
    //   const msgB = new Date(b.createdAt).getTime();
    //   return (msgA === msgB) ? 0 : (msgA < msgB) ? -1 : 1;
    // });

    // this.chat.on('BROADCAST_SEND_MESSAGE', (message) => {
    //   console.log('BROADCAST_SEND_MESSAGE', message);
    //   this.room.messages.push(message);
    // });
    this.chat.listenEmittedMessages().subscribe((message) => {
      console.log('BROADCAST_SEND_MESSAGE', message);
      this.room.messages.push(message);
    });
  }

  onMessageSent(message) {
    this.room.messages.push(message);
  }

}
