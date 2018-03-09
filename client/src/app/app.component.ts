import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showMenu = false;
  constructor(private auth: AuthService) { }
  ngOnInit() {
    this.auth.isAuthentificated.subscribe(isAuth => this.showMenu = isAuth);
  }
}
