import { Component, OnInit, Renderer2, ElementRef, ViewChild, Output, EventEmitter, OnDestroy, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/delay';
import { EmojiService } from './emoji.service';
import { Emoji } from '../../shared/models';

@Component({
  selector: 'app-emoji-picker',
  templateUrl: 'emoji-picker.component.html',
  styleUrls: ['emoji-picker.component.scss'],
})

export class EmojiPickerComponent implements OnInit, OnDestroy {
  @ViewChild('emojiContainer') $emojiContainer: ElementRef;
  @Output() onEmojiPicked = new EventEmitter<string>();

  private $elementTriggerer: HTMLButtonElement;
  private subscriptions: Subscription[] = [];
  private emojisCopy: Emoji[];

  onSearch = new Subject<KeyboardEvent>();
  searchValue;
  visible = false;
  emojis: Emoji[] = [];

  constructor(private renderer: Renderer2, private emojiSvc: EmojiService) { }

  ngOnInit() {
    this.emojis = this.emojiSvc.getEmojis();
    this.emojisCopy = Object.assign([], this.emojis);

    this.subscriptions.push(
      this.emojiSvc.isEmojiPopupVisible.subscribe(isVisible => {
        this.visible = isVisible;
        if (this.visible) {
          this.calculatePopupPosition();
        } else {
          this.searchValue = '';
          this.resetEmojis();
        }
      }),
      this.emojiSvc.elementTriggerer.subscribe(triggerer => {
        this.$elementTriggerer = triggerer;
      }),
      this.onSearch
        .map(e => (e.target as HTMLInputElement).value)
        .debounceTime(1000)
        .distinctUntilChanged()
        .flatMap(search => Observable.of(search))
        .subscribe(search => {
          if (search === '') {
            this.resetEmojis();
          } else {
            this.emojis = this.emojiSvc.findEmojis(search);
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  @HostListener('window:click') onClickOutsidePopup() {
    // Close emoji popup if we click outside of the container
    this.emojiSvc.toggleEmojiPopup();
  }

  onClickInPopup(e: MouseEvent) {
    // If we click inside the container we stop the event propagation
    // So the click event will not trigger the click event of the window
    e.stopPropagation();
  }

  onPickEmoji(emoji) {
    this.onEmojiPicked.next(emoji);
  }

  private calculatePopupPosition() {
    const margin = 5;
    const bodyBCR = document.body.getBoundingClientRect();
    const btnBCR = this.$elementTriggerer.getBoundingClientRect();
    const bottom = Math.abs(btnBCR.bottom - bodyBCR.bottom) + this.$elementTriggerer.clientHeight + margin;
    const right = Math.abs(btnBCR.right - bodyBCR.right);
    this.renderer.setStyle(this.$emojiContainer.nativeElement, 'bottom', bottom + 'px');
    this.renderer.setStyle(this.$emojiContainer.nativeElement, 'right', right + 'px');
  }

  private resetEmojis() {
    this.emojis = Object.assign([], this.emojisCopy);
  }

}
