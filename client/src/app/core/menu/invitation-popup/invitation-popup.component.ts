import { ShadowService } from './../../shadow/shadow.service';
import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CoreService } from '../../core.service';

@Component({
  selector: 'app-invitation-popup',
  templateUrl: 'invitation-popup.component.html',
  styleUrls: ['invitation-popup.component.scss']
})

export class InvitationPopupComponent implements OnInit {
  @Input() visible;
  @Output() visibleChange = new EventEmitter<boolean>();
  constructor(
    private core: CoreService,
    private shadow: ShadowService) { }
  ngOnInit() { }
  onClickOutside() {
    this.close();
  }
  onGenerateCode() {
    // TODO: Generate go later
    const currentRoomId = this.core.currentRoom.id;
    this.core.generateJoinToken(currentRoomId).subscribe(response => {
      console.log('response', response);
    });
  }
  private close() {
    this.visibleChange.next(false);
    this.shadow.onShadowVisibilityChanged.next(false);
  }
}
