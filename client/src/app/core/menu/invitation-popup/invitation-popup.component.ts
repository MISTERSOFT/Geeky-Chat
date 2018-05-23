import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ShadowService } from '@core/shadow';
import { CoreService } from '@core/index';

@Component({
  selector: 'app-invitation-popup',
  templateUrl: 'invitation-popup.component.html',
  styleUrls: ['invitation-popup.component.scss']
})

export class InvitationPopupComponent implements OnInit {
  @Input() visible;
  @Output() visibleChange = new EventEmitter<boolean>();
  token: string;
  constructor(
    private core: CoreService,
    private shadow: ShadowService) { }
  ngOnInit() { }
  onClickOutside() {
    this.close();
  }
  onGenerateCode() {
    const currentRoomId = this.core.currentRoom.id;
    const sub = this.core.generateJoinToken(currentRoomId).subscribe(response => {
      this.token = response.data.token;
      sub.unsubscribe();
    });
  }
  private close() {
    this.token = '';
    this.visibleChange.next(false);
    this.shadow.onShadowVisibilityChanged.next(false);
  }
}
