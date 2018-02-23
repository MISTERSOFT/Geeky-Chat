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
      this.messages = response.data.messages;
    });
  }

  onSend() {
    const message: MessageSent = {
      text: this.text,
      userId: this.auth.getUser().id
    };
    this.chat.sendMessage(message).subscribe(response => {
      console.log('message stored and now we can add it to the chat', response);
    })
  }
}
