import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators'
import { Socket } from 'ng-socket-io';
import { User, Response } from '@shared/models';
import { WebSocketService } from './websocket.service';

@Injectable()
export class AuthService extends WebSocketService {
  private _user: User;
  userObs = new Subject<User>();
  isAuthentificated: Subject<boolean> = new Subject<boolean>();

  constructor() {
    super();
    this.isAuthentificated.next(false);
  }

  get user() {
    return this._user;
  }

  signup(user) {
    this.emit('SIGNUP', user);
    return this.waitResponse('SIGNUP_RESPONSE');
  }

  signin(user): Observable<Response<User>> {
    this.emit('SIGNIN', user);
    return this.waitResponse('SIGNIN_RESPONSE').pipe(
      tap((response: Response<User>) => {
        if (response.success) {
          this._user = response.data;
          this.userObs.next(this._user);
          this.isAuthentificated.next(true);
        }
      })
    );
  }

  isAuth() {
    console.log('isAuth', this._user);
    return (this._user === null || this._user === undefined) ? false : true;
  }
}
