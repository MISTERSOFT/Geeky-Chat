import { Component, Input } from '@angular/core';
import { Message } from '../../shared/models';

@Component({
  selector: 'app-chat-message',
  templateUrl: 'message.component.html'
})

export class MessageComponent {
  @Input() message: Message;
  constructor() { }
}
