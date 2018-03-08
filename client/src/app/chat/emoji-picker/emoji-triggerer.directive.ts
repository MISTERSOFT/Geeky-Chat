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

  @HostListener('click', ['$event']) onClick(e: MouseEvent) {
    // Stop propagation to prevent click on window (cf. EmojiPickerComponent)
    e.stopPropagation();
    this.emojiSvc.toggleEmojiPopup();
  }
}
