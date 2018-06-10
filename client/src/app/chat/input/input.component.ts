import { AfterViewInit, Component, DoCheck, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { AuthService } from '@core/index';
import { Message, MessageSent, Response } from '@shared/models';
import { Subject } from 'rxjs/Subject';
import { ChatService } from './../chat.service';

@Component({
  selector: 'app-input',
  templateUrl: 'input.component.html',
  styleUrls: ['input.component.scss']
})

export class InputComponent implements OnInit, DoCheck, AfterViewInit, OnDestroy {
  @Input() roomId: string;
  // TODO: Remove later
  @Output() onMessageSent = new EventEmitter<Message>();
  @ViewChild('container') $container: ElementRef;
  @ViewChild('textarea') $textarea: ElementRef;
  @Output() onInputHeightChange = new EventEmitter<string>();
  text: string = ''; // Message to send
  charsLimit = 5000;
  charsCount = 5000;
  rowsInTextarea = 1;
  maxRowsToDisplay = 8;
  typing$: Subject<KeyboardEvent> = new Subject<KeyboardEvent>();
  // private _textareaBaseHeight;
  private _destroy = false;

  constructor(
    private renderer: Renderer2,
    private auth: AuthService,
    private chat: ChatService) { }

  ngOnInit() {
    this.chat.fromEvent('SEND_MESSAGE_RESPONSE').takeWhile(() => !this._destroy).subscribe((response: Response<Message>) => {
      if (response.success) {
        this.chat.pushMessageInCurrentRoom(response.data);
      }
    });

    // this.typing$
    //   .pipe(
    //     map(e => )
    //   )
  }
  ngDoCheck() {
    this.charsCount = this.charsLimit - this.text.length;
  }
  ngAfterViewInit() {
    // this._textareaBaseHeight = (this.$container.nativeElement as HTMLDivElement).style.height
    // console.log('Container', this.$container.nativeElement);
  }
  ngOnDestroy() {
    this._destroy = true;
  }

  onKeyDown(e: KeyboardEvent) {
    // console.log('key ev', e);
    setTimeout(() => this.calculateTextareaRows(), 0);
    // If "Enter" has been pressed and "Shift" not
    if (e.keyCode === 13 && !e.shiftKey) {
      setTimeout(() => {
        this.text = this.text;
        this.onSend();
      }, 0);
    }
  }

  calculateTextareaRows() { // (target: HTMLTextAreaElement) {
    const target = this.$textarea.nativeElement;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = '16px Arial';
    const textLength = Math.ceil(ctx.measureText(target.value).width);
    const elementPadLeft = 7;
    const elementWidth = target.clientWidth - elementPadLeft;
    const elementHeight = target.clientHeight;
    console.log('textarea length textLength', textLength);
    console.log('textarea width', elementWidth);
    // If the text return to a new row, we calculate the number of rows
    if (textLength > elementWidth) {
      this.rowsInTextarea = Math.ceil(textLength / elementWidth);
      if (this.rowsInTextarea >= this.maxRowsToDisplay) {
        this.renderer.setStyle(target, 'overflow-y', 'scroll');
      } else {
        const fontSize = this.rowsInTextarea === 2 ? 16 : 23;
        const height = (this.rowsInTextarea * fontSize) + 60;
        // const height = elementHeight + (this._textareaRows * fontSize);
        this.onInputHeightChange.next(height + 'px');
        console.log('row, new height', this.rowsInTextarea, height);
        this.renderer.setStyle(this.$textarea.nativeElement, 'overflow-y', 'hidden');
        this.renderer.setStyle(this.$container.nativeElement, 'height', height + 'px');
      }
    }
    else if ((this.$container.nativeElement as HTMLDivElement).clientHeight !== 60) {
      this.resetInputHeight();
    }
  }

  private resetInputHeight() {
    const defaultHeight = '60px';
    this.onInputHeightChange.next(defaultHeight);
    this.renderer.setStyle(this.$textarea.nativeElement, 'overflow-y', 'hidden');
    this.renderer.setStyle(this.$container.nativeElement, 'height', defaultHeight);
  }

  onSend() {
    if (this.text.trim() !== '') {
      const copy = this.text;
      this.text = '';
      this.resetInputHeight();
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
