import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { EMOJIS } from './emoji';
import { Emoji } from '../../shared/models';

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

  findEmojis(search) {
    return EMOJIS.filter((emoji: Emoji) => {
      if (emoji.description.toLowerCase().includes(search) ||
        emoji.tags.join(' ').toLowerCase().includes(search) ||
        emoji.aliases.join(' ').toLowerCase().includes(search)) {
        return emoji;
      }
    });
  }
}
