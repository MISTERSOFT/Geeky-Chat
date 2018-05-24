import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { LocalStorageService } from 'ngx-store';
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
    private storage: LocalStorageService,
    private core: CoreService,
    private auth: AuthService) {
      const opts = Object.assign({}, environment.socketConfig);
      const token = this.storage.get('token');
      if (token) {
        environment.socketConfig.options.query.auth_token = token;
      } else {
        environment.socketConfig.options.query.auth_token = null;
      }
    }
  ngOnInit() {
    // this.core.showMenu.subscribe(show => this.showMenu = show);
    this.auth.isAuthentificated.subscribe(isAuth => this.core.showMenu.next(isAuth));

    // this.auth.on('error', (err) => {
    //   console.log('unauthorized', err);
    // });
  }
}
