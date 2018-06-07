import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanLoad, Resolve, Route, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@core/index';
import { User } from '@shared/models';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanLoad, Resolve<User> {
  constructor(
    private auth: AuthService,
    private router: Router) { }

  canLoad(route: Route): boolean {
    if (this.auth.isAuth()) {
      return true;
    }
    this.router.navigate(['signin']);
    return false;
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.auth.getTokenFromLocalStorage();
    if (user) {
      return this.auth.getUserData((user as User).id);
    }
    return Observable.of(false);
  }
}
