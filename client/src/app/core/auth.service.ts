import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '@core/http.service';
import { Response, User } from '@shared/models';
import * as jwtDecode from 'jwt-decode';
import { LocalStorageService } from 'ngx-store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { switchMap, catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators/map';
import { environment } from './../../environments/environment';

@Injectable()
export class AuthService extends HttpService { // extends WebSocketService {
  private _user: User;
  userObs = new Subject<User>();
  // isAuthentificated: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient, private storage: LocalStorageService) {
    super();
    // this.isAuthentificated.next(false);
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
        map((token: string) => {
          // localStorage.setItem(`${environment.localStorageKey.token}`, token);
          this.storage.set('token', token);
          const userData: User = jwtDecode(token);
          const opts = Object.assign({}, environment.socketConfig);
          if (token) {
            environment.socketConfig.options.query.token = token;
          } else {
            environment.socketConfig.options.query.token = null;
          }
          // this._user = userData;
          // this.userObs.next(this._user);
          // this.isAuthentificated.next(true);
          return userData.id;
        }),
        switchMap(this.getUserData)
        // switchMap((userId) => {
        //   return this.http.get(`${this.api}/user/${userId}`, this.options)
        //     .pipe(
        //       tap((response: Response<User>) => {
        //         this._user = response.data;
        //         this.userObs.next(this._user);
        //         this.isAuthentificated.next(true);
        //         return true;
        //       })
        //     )
        // })
      );
  }

  getUserData(userId) {
    if (!this._user) {
      return this.http.get(`${this.api}/user/${userId}`, this.options)
        .pipe(
          map((response: Response<User>) => {
            if (response.success && response.data) {
              this._user = response.data;
              this.userObs.next(this._user);
              // this.isAuthentificated.next(true);
              return true;
            }
            return false;
          }),
          catchError(this.handleError)
        )
    }
    return Observable.of(true);
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
    return this.getTokenFromLocalStorage() ? true : false;
  }

  getTokenFromLocalStorage(): boolean|User {
    const token = this.storage.get('token');
    if (!token) {
      return false;
    }
    try {
      const decodedToken: User = jwtDecode(token);
      // this._user = userData;
      // this.userObs.next(this._user);
      // this.isAuthentificated.next(true);
      // console.log('isAuth', this._user);
      // return this.getUserData(decodedToken.id);
      return decodedToken;
    } catch(e) {
      return false;
    }
  }

}
