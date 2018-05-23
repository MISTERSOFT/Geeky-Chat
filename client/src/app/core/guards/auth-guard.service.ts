import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, Router } from '@angular/router';
import { AuthService } from '@core/index';

@Injectable()
export class AuthGuard implements CanLoad {
  constructor(private auth: AuthService, private router: Router) { }

  canLoad(route: Route): boolean {
    if (this.auth.isAuth()) {
      return true;
    }
    this.router.navigate(['signin']);
    return false;
  }
}
