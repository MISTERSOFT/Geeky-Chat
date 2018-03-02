import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { MessageSent, Message } from '../../shared/models';
import { AuthService } from '../../core/auth.service';
import { ChatService } from './../chat.service';

@Component({
  selector: 'app-input',
  templateUrl: 'input.component.html',
  styleUrls: ['input.component.scss']
})

export class InputComponent implements OnInit {
  @Output() onMessageSent: EventEmitter<Message> = new EventEmitter<Message>();
  text: string; // Message to send

  constructor(
    private auth: AuthService,
    private chat: ChatService) { }

  ngOnInit() { }

  onSend() {
    const message: MessageSent = {
      text: this.text,
      userId: this.auth.getUser().id
    };
    const subscribe = this.chat.sendMessage(message).subscribe(response => {
      this.onMessageSent.next(response.data);
      this.text = '';
      subscribe.unsubscribe();
    });
  }
}
