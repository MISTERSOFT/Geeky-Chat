import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CoreService } from '@core/index';
import { ShadowService } from '@core/shadow';

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
    // const sub =
    this.core.generateJoinToken(currentRoomId, (response) => this.token = response.data.token);
    // .subscribe(response => {
    //   this.token = response.data.token;
    //   sub.unsubscribe();
    // });
  }
  private close() {
    this.token = '';
    this.visibleChange.next(false);
    this.shadow.onShadowVisibilityChanged.next(false);
  }
}
