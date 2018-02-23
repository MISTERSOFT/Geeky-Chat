import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, Router } from '@angular/router';
import { AuthService } from './../auth.service';

@Injectable()
export class AuthGuard implements CanLoad {
  constructor(private auth: AuthService, private router: Router) { }

  canLoad(route: Route): boolean {
    this.router.navigate(['signin']);
    return this.auth.isAuth();
  }
}
