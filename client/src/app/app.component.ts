import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth.service';
import { CoreService } from './core/core.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showMenu = false;
  constructor(
    private core: CoreService,
    private auth: AuthService) { }
  ngOnInit() {
    // this.core.showMenu.subscribe(show => this.showMenu = show);
    this.auth.isAuthentificated.subscribe(isAuth => this.core.showMenu.next(isAuth));
  }
}
