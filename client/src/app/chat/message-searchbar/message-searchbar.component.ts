import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-message-searchbar',
  templateUrl: 'message-searchbar.component.html',
  styleUrls: ['./message-searchbar.component.scss']
})

export class MessageSearchBarComponent implements OnInit {
  @Input() visible = true;
  @Output() visibleChange = new EventEmitter<boolean>();
  search$ = new Subject<KeyboardEvent>();
  @Output() onSearch = new EventEmitter<string>();
  @Output() onSearchPrevious = new EventEmitter<boolean>();
  @Output() onSearchNext = new EventEmitter<boolean>();

  ngOnInit() {
    this.search$
      .map(e => (e.target as HTMLInputElement).value)
      .debounceTime(1000)
      .distinctUntilChanged()
      .flatMap(search => Observable.of(search))
      .subscribe(search => this.onSearch.next(search));
  }

  close() {
    this.visible = false;
    this.visibleChange.next(this.visible);
  }
}
