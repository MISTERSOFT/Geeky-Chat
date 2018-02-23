import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'signin', loadChildren: 'app/signin/signin.module#SigninModule' },
  { path: 'signup', loadChildren: 'app/signup/signup.module#SignupModule' },
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
