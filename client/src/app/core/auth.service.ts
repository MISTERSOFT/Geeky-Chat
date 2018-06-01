import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '@core/http.service';
import { User } from '@shared/models';
import * as jwtDecode from 'jwt-decode';
import { LocalStorageService } from 'ngx-store';
import { Subject } from 'rxjs/Subject';
import { tap } from 'rxjs/operators/tap';
import { environment } from './../../environments/environment';

@Injectable()
export class AuthService extends HttpService { // extends WebSocketService {
  private _user: User;
  userObs = new Subject<User>();
  isAuthentificated: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient, private storage: LocalStorageService) {
    super();
    this.isAuthentificated.next(false);
  }

  get user() {
    return this._user;
  }

  signup(user, callback: Function) {
    // this.emit('SIGNUP', user, callback);
    // return this.waitResponse('SIGNUP_RESPONSE');
  }

  signin(user) {
    const body = JSON.stringify(user);
    return this.http.post(`${this.api}/signin`, body, this.options)
      .pipe(
        tap((token: string) => {
          // localStorage.setItem(`${environment.localStorageKey.token}`, token);
          this.storage.set('token', token);
          const userData = jwtDecode(token);
          const opts = Object.assign({}, environment.socketConfig);
          if (token) {
            environment.socketConfig.options.query.token = token;
          } else {
            environment.socketConfig.options.query.token = null;
          }
          this._user = userData;
          this.userObs.next(this._user);
          this.isAuthentificated.next(true);
        })
      );
  }
  // signin(user, callback: Function) { // : Observable<Response<User>> {
  //   this.emit('SIGNIN', user, (response: Response<User>) => {
  //     if (response.success) {
  //       this._user = response.data;
  //       this.userObs.next(this._user);
  //       this.isAuthentificated.next(true);
  //       callback();
  //     }
  //   });
  //   // return this.waitResponse('SIGNIN_RESPONSE').pipe(
  //   //   tap((response: Response<User>) => {
  //   //     if (response.success) {
  //   //       this._user = response.data;
  //   //       this.userObs.next(this._user);
  //   //       this.isAuthentificated.next(true);
  //   //     }
  //   //   })
  //   // );
  // }

  isAuth() {
    const token = this.storage.get('token');
    if (!token) {
      return false;
    }
    const userData = jwtDecode(token);
    this._user = userData;
    this.userObs.next(this._user);
    this.isAuthentificated.next(true);
    console.log('isAuth', this._user);
    return true;
  }
}
