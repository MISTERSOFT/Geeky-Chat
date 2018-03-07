import { Component, OnInit, Renderer2, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { EmojiService } from './emoji.service';

@Component({
  selector: 'app-emoji-picker',
  templateUrl: 'emoji-picker.component.html',
  styleUrls: ['emoji-picker.component.scss'],
})

export class EmojiPickerComponent implements OnInit {
  @ViewChild('emojiContainer') $emojiContainer: ElementRef;
  @Output() onEmojiPicked = new EventEmitter<string>();

  private $elementTriggerer: HTMLButtonElement;

  visible = false;
  emojis = [];

  constructor(private renderer: Renderer2, private emojiSvc: EmojiService) { }

  ngOnInit() {
    this.emojis = this.emojiSvc.getEmojis();
    this.emojiSvc.isEmojiPopupVisible.subscribe(isVisible => {
      this.visible = isVisible;
      if (this.visible) {
        this.calculatePopupPosition();
      }
    });
    this.emojiSvc.elementTriggerer.subscribe(triggerer => {
      this.$elementTriggerer = triggerer;
    });
  }

  private calculatePopupPosition() {
    const bodyBCR = document.body.getBoundingClientRect();
    const btnBCR = this.$elementTriggerer.getBoundingClientRect();
    const bottom = Math.abs(btnBCR.bottom - bodyBCR.bottom) + this.$elementTriggerer.clientHeight + 5;
    const right = Math.abs(btnBCR.right - bodyBCR.right);
    this.renderer.setStyle(this.$emojiContainer.nativeElement, 'bottom', bottom + 'px');
    this.renderer.setStyle(this.$emojiContainer.nativeElement, 'right', right + 'px');
  }

  onPickEmoji(emoji) {
    this.onEmojiPicked.next(emoji);
  }
}
