import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Message } from '../../shared/models';

@Component({
  selector: 'app-chat-message',
  templateUrl: 'message.component.html',
  styleUrls: ['message.component.scss']
})

export class MessageComponent implements OnChanges, AfterViewInit {
  @Input() message: Message;
  @ViewChild('tileMessage') $tileMessage: ElementRef;
  offsetTop = 0;
  constructor(private auth: AuthService) { }

  ngOnChanges(changes) {
    this.message.isMine = this.auth.user.id === this.message.user.id;
  }

  ngAfterViewInit() {
    this.offsetTop = this.$tileMessage.nativeElement.offsetTop;
  }

  formatWithBreakLine(value: string) {
    return value.replace(/(\r\n|\n|\r)/g, '<br />');
  }

  /**
   * Highlight search value
   * @param searchValue {string}
   */
  surroundSearchedValue(searchValue) {
    this.removeSurroundedText();
    if (searchValue !== '' && this.message.text.includes(searchValue)) {
      this.message.text = this.message.text.replace(searchValue, '<span class="search-highlight">' + searchValue + '</span>');
      return true;
    }
    return false;
  }

  /**
   * Remove highlight
   */
  removeSurroundedText() {
    this.message.text = this.message.text.replace('<span class="search-highlight">', '').replace('</span>', '');
  }
}
