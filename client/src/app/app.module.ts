import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketService } from './services/socket.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ChatComponent } from './components/chat/chat.component';
import { HomeComponent } from './components/home/home.component';
import { ChatItemComponent } from './components/chat-item/chat-item.component';
import { ActiveUsersComponent } from './components/active-users/active-users.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    HomeComponent,
    ChatItemComponent,
    ActiveUsersComponent,
    HeaderComponent,
    FooterComponent
  ],
    imports: [
      BrowserModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      ToastrModule.forRoot({ timeOut: 3000 }),
      ReactiveFormsModule,
      HttpClientModule
    ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
