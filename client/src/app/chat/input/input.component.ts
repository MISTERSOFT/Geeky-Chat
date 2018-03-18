import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef, Input } from '@angular/core';
import { MessageSent, Message } from '../../shared/models';
import { AuthService } from '../../core/auth.service';
import { ChatService } from './../chat.service';

@Component({
  selector: 'app-input',
  templateUrl: 'input.component.html',
  styleUrls: ['input.component.scss']
})

export class InputComponent implements OnInit {
  @Input() roomId: string;
  @Output() onMessageSent: EventEmitter<Message> = new EventEmitter<Message>();
  text: string = ''; // Message to send

  constructor(
    private auth: AuthService,
    private chat: ChatService) { }

  ngOnInit() { }

  onKeyPress(e) {
    // If "Enter" has been pressed
    if (e.keyCode === 13 && !e.shiftKey) {
      setTimeout(() => {
        this.text = this.text;
        this.onSend();
      }, 0);
    }
  }

  onSend() {
    if (this.text.trim() !== '') {
      const copy = this.text;
      this.text = '';
      const message: MessageSent = {
        text: copy,
        userId: this.auth.getUser().id,
        roomId: this.roomId
      };
      console.log('Send message...', message);
      const subscribe = this.chat.sendMessage(message).subscribe(response => {
        this.onMessageSent.next(response.data);
        subscribe.unsubscribe();
      });
    }
  }

  onEmojiPicked(emoji) {
    this.text += emoji;
  }
}
