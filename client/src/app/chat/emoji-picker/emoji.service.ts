import { Injectable } from '@angular/core';
import { EMOJIS } from './emoji';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EmojiService {
  private _isEmojiPopupVisible = false;
  isEmojiPopupVisible = new Subject<boolean>();
  elementTriggerer = new Subject<any>();

  constructor() {
    this.isEmojiPopupVisible.next(this._isEmojiPopupVisible);
  }

  toggleEmojiPopup() {
    this._isEmojiPopupVisible = !this._isEmojiPopupVisible;
    this.isEmojiPopupVisible.next(this._isEmojiPopupVisible);
  }

  setElementTriggerer(element: any) {
    this.elementTriggerer.next(element);
  }

  getEmojis() {
    return EMOJIS;
  }
}
