import { Injectable } from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';
import { AuthService } from '@core/index';

@Injectable()
export class AuthGuard implements CanLoad {
  constructor(private auth: AuthService, private router: Router) { }

  canLoad(route: Route): boolean {
    if (this.auth.isAuth()) {
      // Prevent user to go to signin/signup pages when the user is logged
      if (route.path === 'signin' || route.path === 'signup') {
        return false;
      }
      return true;
    }
    this.router.navigate(['signin']);
    return false;
  }
}
