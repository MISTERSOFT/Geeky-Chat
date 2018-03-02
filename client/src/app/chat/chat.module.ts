import { NgModule } from '@angular/core';

import { ChatRoutingModule } from './chat-routing.component';
import { SharedModule } from './../shared/shared.module';

import { ChatService } from './chat.service';

import { ChatComponent } from './chat.component';
import { MessageComponent } from './message/message.component';
import { InputComponent } from './input/input.component';

@NgModule({
  imports: [
    ChatRoutingModule,
    SharedModule
  ],
  declarations: [
    ChatComponent,
    MessageComponent,
    InputComponent
  ],
  providers: [
    ChatService
  ]
})
export class ChatModule { }
