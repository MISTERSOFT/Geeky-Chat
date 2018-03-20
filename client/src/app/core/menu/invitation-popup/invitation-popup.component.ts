import { ShadowService } from './../../shadow/shadow.service';
import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-invitation-popup',
  templateUrl: 'invitation-popup.component.html',
  styleUrls: ['invitation-popup.component.scss']
})

export class InvitationPopupComponent implements OnInit {
  @Input() visible;
  @Output() visibleChange = new EventEmitter<boolean>();
  constructor(private shadow: ShadowService) { }
  ngOnInit() { }
  onClickOutside() {
    this.close();
  }
  onGenerateCode() {
    // TODO: Generate go later
  }
  private close() {
    this.visibleChange.next(false);
    this.shadow.onShadowVisibilityChanged.next(false);
  }
}
