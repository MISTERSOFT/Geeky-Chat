import { Component, Input, AfterViewInit } from '@angular/core';
import { Message } from '../../shared/models';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-chat-message',
  templateUrl: 'message.component.html'
})

export class MessageComponent implements AfterViewInit {
  @Input() message: Message;
  constructor(private auth: AuthService) { }

  ngAfterViewInit() {
    this.message.isMine = this.auth.getUser().id === this.message.user.id;
  }

}
