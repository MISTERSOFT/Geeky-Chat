import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HumanizePipe } from './pipes/humanize.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HumanizePipe
  ],
  declarations: [
    HumanizePipe
  ]
})
export class SharedModule { }
