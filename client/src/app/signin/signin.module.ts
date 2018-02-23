import { NgModule } from '@angular/core';

import { SigninRoutingModule } from './signin-routing.module';
import { SharedModule } from './../shared/shared.module';

import { SigninComponent } from './signin.component';

@NgModule({
  imports: [
    SigninRoutingModule,
    SharedModule
  ],
  declarations: [SigninComponent]
})
export class SigninModule { }
