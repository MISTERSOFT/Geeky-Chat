import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/models';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.scss']
})

export class MenuComponent implements OnInit {
  user: User;
  showMore = false;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.user = this.auth.getUser();
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
  }
}
