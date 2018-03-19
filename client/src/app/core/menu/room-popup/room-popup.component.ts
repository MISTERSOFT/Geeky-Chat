import { ShadowService } from './../../shadow/shadow.service';
import { Component, OnInit, Input, Output, EventEmitter, Renderer2, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CoreService } from '../../core.service';
import { AuthService } from '../../auth.service';

enum SLIDE {
  MENU,
  CREATE,
  JOIN
}

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
  @ViewChild('slideJoin') $slideJoin: ElementRef;
  roomName: string;
  invitationCode: string;
  _SLIDE = SLIDE;
  private slideBy = 450;
  private slideDefaultLeftPosition = 0;
  private currentSlide: SLIDE = SLIDE.MENU;
  constructor(
    private renderer: Renderer2,
    private core: CoreService,
    private auth: AuthService,
    private shadow: ShadowService) { }
  ngOnInit() { }
  @HostListener('click', ['$event']) onHostClicked(e: MouseEvent) {
    // Prevent popup close when we click on container
    e.stopPropagation();
  }
  @HostListener('window:click', ['$event']) onClickOutsidePopup(e) {
    // Check if we have clicked in the add/join new room button
    if (!e.target.classList.contains('button-new-room')) {
      // Close the popup if we click outside of the container
      this.reset();
      this.visibleChange.next(false);
      this.shadow.onShadowVisibilityChanged.next(false);
    }
  }
  slideTo(goTo: SLIDE) {
    if (goTo === SLIDE.CREATE) {
      this.slide(this.$slideMenu.nativeElement, -this.slideBy);
      this.slide(this.$slideCreate.nativeElement, -this.slideBy);
    } else if (goTo === SLIDE.JOIN) {
      this.slide(this.$slideMenu.nativeElement, -this.slideBy);
      this.slide(this.$slideJoin.nativeElement, -this.slideBy);
    } else {
      if (this.currentSlide === SLIDE.CREATE) {
        this.slide(this.$slideCreate.nativeElement, this.slideBy);
      }
      if (this.currentSlide === SLIDE.JOIN) {
        this.slide(this.$slideJoin.nativeElement, this.slideBy);
      }
      this.slide(this.$slideMenu.nativeElement, this.slideDefaultLeftPosition);
    }
    this.currentSlide = goTo;
  }
  createRoom() {
    this.core.createRoom(this.roomName, this.auth.getUser().id);
    this.visible = false;
    this.visibleChange.next(this.visible);
    this.shadow.onShadowVisibilityChanged.next(false);
  }

  private slide(el, value) {
    this.renderer.setStyle(el, 'transform', 'translateX(' + value + 'px)');
  }

  private reset() {
    this.roomName = '';
    this.invitationCode = '';
    this.slideTo(SLIDE.MENU);
  }
}
