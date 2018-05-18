import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';

import { OptionsRoutingModule } from './options-routing.module';
import { OptionsComponent } from './options.component';
import { ProfileComponent } from './profile/profile.component';
import { OptionsService } from './options.service';
import { LayoutModule } from '../layout/layout.module';

@NgModule({
  imports: [
    OptionsRoutingModule,
    SharedModule,
    LayoutModule
  ],
  declarations: [
    OptionsComponent,
    ProfileComponent,
  ],
  providers: [OptionsService]
})
export class OptionsModule { }
