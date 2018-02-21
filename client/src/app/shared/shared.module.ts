import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    FormsModule,
    CommonModule
  ],
  exports: [
    FormsModule,
    CommonModule
  ],
  declarations: []
})
export class SharedModule { }
