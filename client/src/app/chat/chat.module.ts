import { NgModule } from '@angular/core';

import { ChatRoutingModule } from './chat-routing.component';
import { SharedModule } from './../shared/shared.module';

import { ChatService } from './chat.service';

import { ChatComponent } from './chat.component';
import { MessageComponent } from './message/message.component';
import { InputComponent } from './input/input.component';
import { EmojiPickerComponent } from './emoji-picker/emoji-picker.component';
import { InputAutoResizeDirective } from './input/input-autoresize.directive';
import { EmojiService } from './emoji-picker/emoji.service';
import { EmojiTriggererDirective } from './emoji-picker/emoji-triggerer.directive';

@NgModule({
  imports: [
    ChatRoutingModule,
    SharedModule
  ],
  declarations: [
    ChatComponent,
    MessageComponent,
    InputComponent,
    EmojiPickerComponent,
    InputAutoResizeDirective,
    EmojiTriggererDirective
  ],
  providers: [
    ChatService,
    EmojiService
  ]
})
export class ChatModule { }
