import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/models';
import { AuthService } from '../auth.service';
import { ShadowService } from '../shadow/shadow.service';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.scss']
})

export class MenuComponent implements OnInit {
  user: User;
  showMore = false;
  showRoomPopup = false;

  constructor(
    private auth: AuthService,
    private shadow: ShadowService) { }

  ngOnInit() {
    this.user = this.auth.getUser();
    console.log('user', this.user);
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
  }

  openRoomPopup() {
    this.shadow.onShadowVisibilityChanged.next(true);
    this.showRoomPopup = true;
  }
}
