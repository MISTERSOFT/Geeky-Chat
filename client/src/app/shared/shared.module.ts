import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HumanizePipe } from './pipes/humanize.pipe';
import { ToastComponent } from './toast/toast.component';
import { ToastDirective } from './toast/toast.directive';
import { ToastService } from './toast/toast.service';
import { CropperPopupComponent } from './cropper/cropper-popup.component';
import { CropperComponent } from './cropper/cropper/cropper.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HumanizePipe,
    ToastDirective,
    CropperPopupComponent
  ],
  declarations: [
    HumanizePipe,
    ToastComponent,
    ToastDirective,
    CropperPopupComponent,
    CropperComponent
  ],
  providers: [
    ToastService
  ],
  entryComponents: [
    ToastComponent
  ]
})
export class SharedModule { }
