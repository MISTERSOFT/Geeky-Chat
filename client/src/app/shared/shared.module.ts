import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CropperPopupComponent } from './cropper/cropper-popup.component';
import { CropperComponent } from './cropper/cropper/cropper.component';
import { HumanizePipe } from './pipes/humanize.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HumanizePipe,
    CropperPopupComponent
  ],
  declarations: [
    HumanizePipe,
    CropperPopupComponent,
    CropperComponent
  ],
  providers: [
  ],
  entryComponents: [
  ]
})
export class SharedModule { }
