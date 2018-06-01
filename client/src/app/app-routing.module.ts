import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, NoNeedToLoginGuard } from '@core/guards';

const routes: Routes = [
  { path: 'signin', loadChildren: 'app/signin/signin.module#SigninModule', canLoad: [NoNeedToLoginGuard] },
  { path: 'signup', loadChildren: 'app/signup/signup.module#SignupModule', canLoad: [NoNeedToLoginGuard] },
  { path: 'r', loadChildren: 'app/chat/chat.module#ChatModule', canLoad: [AuthGuard], resolve: [AuthGuard] },
  { path: 'options', loadChildren: 'app/options/options.module#OptionsModule', canLoad: [AuthGuard], resolve: [AuthGuard] },
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // { enableTracing: true }
  exports: [RouterModule]
})
export class AppRoutingModule { }
