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
      this.messages = response.data;
    });
    this.chat.on('BROADCAST_SEND_MESSAGE', (message) => {
      console.log('BROADCAST_SEND_MESSAGE', message);
      this.messages.push(message);
    });
  }

  onSend() {
    const message: MessageSent = {
      text: this.text,
      userId: this.auth.getUser().id
    };
    const subscribe = this.chat.sendMessage(message).subscribe(response => {
      this.messages.push(response.data);
      this.text = '';
      subscribe.unsubscribe();
    });
  }

}
