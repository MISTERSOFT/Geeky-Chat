import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { LocalStorageService } from 'ngx-store';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showMenu = false;
  constructor(
    private storage: LocalStorageService,
    // private core: CoreService,
    private auth: AuthService) {
      const token = this.storage.get('token');
      if (token) {
        const opts = Object.assign({}, environment.socketConfig);
        if (token) {
          environment.socketConfig.options.query.token = token;
        } else {
          environment.socketConfig.options.query.token = null;
        }
      }
    }
  ngOnInit() {
    // this.core.showMenu.subscribe(show => this.showMenu = show);
    // this.auth.isAuthentificated.subscribe(isAuth => this.core.showMenu.next(isAuth));

    // this.core.on('error', (err) => {
    //   console.log('unauthorized', err);
    // });
  }
}
