import { NgModule } from '@angular/core';

import { ChatRoutingModule } from './chat-routing.component';
import { SharedModule } from './../shared/shared.module';

import { ChatService } from './chat.service';

import { ChatComponent } from './chat.component';
import { MessageComponent } from './message/message.component';
import { InputComponent } from './input/input.component';
import { InputAutoResizeDirective } from './input/input-autoresize.directive';

@NgModule({
  imports: [
    ChatRoutingModule,
    SharedModule
  ],
  declarations: [
    ChatComponent,
    MessageComponent,
    InputComponent,
    InputAutoResizeDirective
  ],
  providers: [
    ChatService
  ]
})
export class ChatModule { }
