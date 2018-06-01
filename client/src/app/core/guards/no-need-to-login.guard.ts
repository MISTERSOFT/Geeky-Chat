import { Injectable } from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';
import { AuthService } from '@core/index';

@Injectable()
export class NoNeedToLoginGuard implements CanLoad {
  constructor(private auth: AuthService, private router: Router) { }

  canLoad(route: Route) {
    if (this.auth.isAuth()) {
      this.router.navigate(['r']);
      return false;
    }
    return true;
  }
}
