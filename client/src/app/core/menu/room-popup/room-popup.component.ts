import { ShadowService } from './../../shadow/shadow.service';
import { Component, OnInit, Input, Output, EventEmitter, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { CoreService } from '../../core.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-room-popup',
  templateUrl: 'room-popup.component.html',
  styleUrls: ['room-popup.component.scss']
})

export class RoomPopupComponent implements OnInit {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @ViewChild('slideMenu') $slideMenu: ElementRef;
  @ViewChild('slideCreate') $slideCreate: ElementRef;
  roomName: string;
  private slideBy = 450;
  private slideDefaultLeftPosition = 0;
  constructor(
    private renderer: Renderer2,
    private core: CoreService,
    private auth: AuthService,
    private shadow: ShadowService) { }
  ngOnInit() { }
  slideToCreateRoom() {
    console.log('slide create', this.$slideCreate);
    this.renderer.setStyle(this.$slideMenu.nativeElement, 'left', -this.slideBy + 'px')
    this.renderer.setStyle(this.$slideCreate.nativeElement, 'left', this.slideDefaultLeftPosition + 'px')
  }
  createRoom() {
    this.core.createRoom(this.roomName, this.auth.getUser().id);
    this.visible = false;
    this.visibleChange.next(this.visible);
    this.shadow.onShadowVisibilityChanged.next(false);
  }
}
