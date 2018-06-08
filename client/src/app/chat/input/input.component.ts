import { Component, DoCheck, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AuthService } from '@core/index';
import { Message, MessageSent, Response } from '@shared/models';
import { ChatService } from './../chat.service';

@Component({
  selector: 'app-input',
  templateUrl: 'input.component.html',
  styleUrls: ['input.component.scss']
})

export class InputComponent implements OnInit, DoCheck, OnDestroy {
  @Input() roomId: string;
  // TODO: Remove later
  @Output() onMessageSent: EventEmitter<Message> = new EventEmitter<Message>();
  text: string = ''; // Message to send
  charsLimit = 5000;
  charsCount = 5000;
  private _destroy = false;

  constructor(
    private auth: AuthService,
    private chat: ChatService) { }

  ngOnInit() {
    this.chat.fromEvent('SEND_MESSAGE_RESPONSE').takeWhile(() => !this._destroy).subscribe((response: Response<Message>) => {
      if (response.success) {
        this.chat.pushMessageInCurrentRoom(response.data);
      }
    });
  }
  ngDoCheck() {
    this.charsCount = this.charsLimit - this.text.length;
  }
  ngOnDestroy() {
    this._destroy = true;
  }
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
        userId: this.auth.user.id,
        roomId: this.roomId
      };
      console.log('Send message...', message);
      // const subscribe =
      this.chat.sendMessage(message);
      // .subscribe(response => {
      //   this.onMessageSent.next(response.data);
      //   // subscribe.unsubscribe();
      // });
    }
  }

  onEmojiPicked(emoji) {
    this.text += emoji;
  }
}
