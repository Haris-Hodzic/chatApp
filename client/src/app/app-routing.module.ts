import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {ActiveUsersComponent} from './components/active-users/active-users.component';
import {ChatComponent} from './components/chat/chat.component';


const routes: Routes = [
  {path: 'messages', component: HomeComponent},
  {path: '', component: ActiveUsersComponent},
  {path: 'chat/:user', component: ChatComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
