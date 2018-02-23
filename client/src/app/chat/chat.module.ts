import { NgModule } from '@angular/core';

import { ChatRoutingModule } from './chat-routing.component';
import { SharedModule } from './../shared/shared.module';

import { ChatComponent } from './chat.component';

@NgModule({
  imports: [
    ChatRoutingModule,
    SharedModule
  ],
  declarations: [ChatComponent]
})
export class ChatModule { }
