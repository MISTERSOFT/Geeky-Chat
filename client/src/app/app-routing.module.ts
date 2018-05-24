import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards';

const routes: Routes = [
  { path: 'signin', loadChildren: 'app/signin/signin.module#SigninModule', canLoad: [AuthGuard] },
  { path: 'signup', loadChildren: 'app/signup/signup.module#SignupModule', canLoad: [AuthGuard] },
  { path: 'chat', loadChildren: 'app/chat/chat.module#ChatModule', canLoad: [AuthGuard] },
  { path: 'options', loadChildren: 'app/options/options.module#OptionsModule', canLoad: [AuthGuard] },
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // { enableTracing: true }
  exports: [RouterModule]
})
export class AppRoutingModule { }
