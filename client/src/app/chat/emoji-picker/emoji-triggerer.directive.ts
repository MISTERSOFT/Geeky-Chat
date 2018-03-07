import { Directive, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { EmojiService } from './emoji.service';

@Directive({ selector: '[appEmojiTriggerer]' })
export class EmojiTriggererDirective implements AfterViewInit {
  constructor(
    private el: ElementRef,
    private emojiSvc: EmojiService) { }

  ngAfterViewInit() {
    this.emojiSvc.setElementTriggerer(this.el.nativeElement);
  }

  @HostListener('click') onClick() {
    this.emojiSvc.toggleEmojiPopup();
  }
}
