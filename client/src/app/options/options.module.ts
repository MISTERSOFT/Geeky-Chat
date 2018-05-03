import { NgModule } from '@angular/core';

import { OptionsRoutingModule } from './options-routing.module';
import { OptionsComponent } from './options.component';

import { SharedModule } from './../shared/shared.module';

@NgModule({
  imports: [
    OptionsRoutingModule,
    SharedModule
  ],
  declarations: [
    OptionsComponent
  ]
})
export class OptionsModule { }
