import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { AuthService } from '@core/index';
import { ChatService } from 'app/chat/chat.service';

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
  @Input() fullscreen = false;
  // @ViewChild('slideMenu') $slideMenu: ElementRef;
  // @ViewChild('slideCreate') $slideCreate: ElementRef;
  // @ViewChild('slideJoin') $slideJoin: ElementRef;
  roomName: string;
  joinToken: string;
  // _SLIDE = SLIDE;
  // private slideBy = 450;
  // private slideDefaultLeftPosition = 0;
  // private currentSlide: SLIDE = SLIDE.MENU;
  constructor(
    private renderer: Renderer2,
    // private core: CoreService,
    private auth: AuthService,
    private chat: ChatService,
    // private shadow: ShadowService
    ) { }
  ngOnInit() { }
  onClosed() {
    this.close();
  }
  // slideTo(goTo: SLIDE) {
  //   if (goTo === SLIDE.CREATE) {
  //     this.slide(this.$slideMenu.nativeElement, -this.slideBy);
  //     this.slide(this.$slideCreate.nativeElement, -this.slideBy);
  //   } else if (goTo === SLIDE.JOIN) {
  //     this.slide(this.$slideMenu.nativeElement, -this.slideBy);
  //     this.slide(this.$slideJoin.nativeElement, -this.slideBy);
  //   } else {
  //     if (this.currentSlide === SLIDE.CREATE) {
  //       this.slide(this.$slideCreate.nativeElement, this.slideBy);
  //     }
  //     if (this.currentSlide === SLIDE.JOIN) {
  //       this.slide(this.$slideJoin.nativeElement, this.slideBy);
  //     }
  //     this.slide(this.$slideMenu.nativeElement, this.slideDefaultLeftPosition);
  //   }
  //   this.currentSlide = goTo;
  // }
  createRoom() {
    this.chat.createRoom(this.roomName, this.auth.user.id);
    this.close();
  }
  joinRoom() {
    // const sub =
    this.chat.joinRoom({userId: this.auth.user.id, token: this.joinToken});
    // .subscribe(() => {
    //   sub.unsubscribe();
    // });
  }
  // private slide(el, value) {
  //   this.renderer.setStyle(el, 'transform', 'translateX(' + value + 'px)');
  // }

  private reset() {
    this.roomName = '';
    this.joinToken = '';
    // this.slideTo(SLIDE.MENU);
  }

  private close() {
    this.reset();
    this.visibleChange.next(false);
    // this.shadow.onShadowVisibilityChanged.next(false);
  }
}
