import { Component, Input, OnChanges } from '@angular/core';
import { Message } from '../../shared/models';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-chat-message',
  templateUrl: 'message.component.html',
  styleUrls: ['message.component.scss']
})

export class MessageComponent implements OnChanges {
  @Input() message: Message;
  constructor(private auth: AuthService) { }

  ngOnChanges(changes) {
    this.message.isMine = this.auth.getUser().id === this.message.user.id;
  }

}
