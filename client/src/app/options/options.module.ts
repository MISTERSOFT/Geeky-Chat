import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { OptionsRoutingModule } from './options-routing.module';
import { OptionsComponent } from './options.component';
import { OptionsService } from './options.service';
import { ProfileComponent } from './profile/profile.component';



@NgModule({
  imports: [
    OptionsRoutingModule,
    SharedModule,
  ],
  declarations: [
    OptionsComponent,
    ProfileComponent,
  ],
  providers: [OptionsService]
})
export class OptionsModule { }
