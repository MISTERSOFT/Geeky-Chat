import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators'
import { Socket } from 'ng-socket-io';
import { User, Response } from '../shared/models';
import { WebSocketService } from './websocket.service';
import { SignInResponse } from './models';

@Injectable()
export class AuthService extends WebSocketService {
  private user: User;
  isAuthentificated: Subject<boolean> = new Subject<boolean>();

  constructor() {
    super();
    this.isAuthentificated.next(false);
  }

  getUser() {
    return this.user;
  }

  signup(user) {
    this.emit('SIGNUP', user);
    return this.waitResponse('SIGNUP_RESPONSE');
  }

  signin(user): Observable<Response<SignInResponse>> {
    this.emit('SIGNIN', user);
    return this.waitResponse('SIGNIN_RESPONSE').pipe(
      tap((response: Response<SignInResponse>) => {
        if (response.success) {
          this.user = response.data.user;
          this.isAuthentificated.next(true);
        }
      })
    );
  }

  isAuth() {
    console.log('isAuth', this.user);
    return (this.user === null || this.user === undefined) ? false : true;
  }
}
