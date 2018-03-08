import { AuthService } from './../core/auth.service';
import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';
import { MessageSent, Message } from '../shared/models';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messages: Message[];
  text: string; // Message to send

  constructor(
    private chat: ChatService,
    private auth: AuthService) { }

  ngOnInit() {
    this.chat.getAllMessages().subscribe(response => {
      console.log('getAllMessages()', response);
      // Store message history and sort all message by date asc
      this.messages = response.data.sort((a, b) => {
        const msgA = new Date(a.createdAt).getTime();
        const msgB = new Date(b.createdAt).getTime();
        return (msgA === msgB) ? 0 : (msgA < msgB) ? -1 : 1;
      });
    });
    this.chat.on('BROADCAST_SEND_MESSAGE', (message) => {
      console.log('BROADCAST_SEND_MESSAGE', message);
      this.messages.push(message);
    });
  }

  onMessageSent(message) {
    this.messages.push(message);
  }

}
