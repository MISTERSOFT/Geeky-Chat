import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import "rxjs/add/operator/takeWhile";
import { Room } from '../shared/models';
import { AuthService } from './../core/auth.service';
import { ChatService } from './chat.service';
import { MessageComponent } from './message/message.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') $messagesContainer: ElementRef;
  @ViewChildren(MessageComponent) $messages: QueryList<MessageComponent>;
  surroundedMessagesPosition = new Array<number>();
  private currentSurroundedMessagePosition: number;
  room: Room;
  scrollTop;
  fromBottom: string;
  isSearchBarVisible;
  /**
   * Is component will be destroyed
   */
  private _destroy = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private chat: ChatService,
    private auth: AuthService) { }

  ngOnInit() {
    // Connect socket if necessary
    if (this.chat.ioSocket.disconnected) {
      this.chat.connect();
    }
    this.chat.load();
    this.chat.onCurrentRoomChanged.takeWhile(() => !this._destroy).subscribe(room => {
      this.room = room;
    });
    this.chat.listenBroadcastedMessages().takeWhile(() => !this._destroy).subscribe((message) => {
      if (message) {
        this.room.messages.push(message);
      }
    });
    this.chat.listenJoiningUser();

    this.chat.on('error', (err) => {
      console.log('server emitted by server', err);
    });
  }

  ngOnDestroy() {
    this._destroy = true;
    this.chat.removeListener('error');
    this.chat.removeListener('CHAT_STATE');
    this.chat.removeListener('CHAT_STATE_CHANGE');
  }

  onMessageSent(message) {
    this.room.messages.push(message);
  }

  onInputHeightChange(height) {
    this.fromBottom = height;
  }

  onSearchBarOpen() {
    this.isSearchBarVisible = true;
  }

  onSearchBarClosed() {
    this.$messages.forEach(msg => msg.removeSurroundedText());
    this.scrollTop = null;
  }

  onSearch(searchValue) {
    this.surroundedMessagesPosition = [];
    this.currentSurroundedMessagePosition = null;
    this.$messages.forEach(messageCmpInstance => {
      const surrounded = messageCmpInstance.surroundSearchedValue(searchValue);
      if (surrounded) {
        this.surroundedMessagesPosition.push(messageCmpInstance.offsetTop);
      }
    });
    if (this.surroundedMessagesPosition.length > 0) {
      this.currentSurroundedMessagePosition = 0;
      this.scrollTop = this.surroundedMessagesPosition[0];
    }
  }

  onSearchPrevious() {
    if (Number.isInteger(this.currentSurroundedMessagePosition)) {
      this.currentSurroundedMessagePosition--;
      if (this.currentSurroundedMessagePosition >= 0 && this.currentSurroundedMessagePosition < this.surroundedMessagesPosition.length) {
        this.scrollTop = this.surroundedMessagesPosition[this.currentSurroundedMessagePosition];
      } else {
        this.currentSurroundedMessagePosition++;
      }
    }
  }

  onSearchNext() {
    if (Number.isInteger(this.currentSurroundedMessagePosition)) {
      this.currentSurroundedMessagePosition++;
      if (this.currentSurroundedMessagePosition < this.surroundedMessagesPosition.length) {
        this.scrollTop = this.surroundedMessagesPosition[this.currentSurroundedMessagePosition];
      } else {
        this.currentSurroundedMessagePosition--;
      }
    }
  }
}
