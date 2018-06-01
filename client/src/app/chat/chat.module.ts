import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { ChatService } from './chat.service';
import { EmojiPickerComponent } from './emoji-picker/emoji-picker.component';
import { EmojiTriggererDirective } from './emoji-picker/emoji-triggerer.directive';
import { EmojiService } from './emoji-picker/emoji.service';
import { InputAutoResizeDirective } from './input/input-autoresize.directive';
import { InputComponent } from './input/input.component';
import { InvitationPopupComponent } from './menu/invitation-popup/invitation-popup.component';
import { MenuComponent } from './menu/menu.component';
import { RoomPopupComponent } from './menu/room-popup/room-popup.component';
import { MessageComponent } from './message/message.component';




@NgModule({
  imports: [
    ChatRoutingModule,
    SharedModule,
  ],
  declarations: [
    ChatComponent,
    MessageComponent,
    InputComponent,
    EmojiPickerComponent,
    InputAutoResizeDirective,
    EmojiTriggererDirective,
    MenuComponent,
    RoomPopupComponent,
    InvitationPopupComponent,
  ],
  providers: [
    ChatService,
    EmojiService
  ]
})
export class ChatModule { }
