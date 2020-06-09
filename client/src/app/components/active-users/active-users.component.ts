import { Component, OnInit } from '@angular/core';
import {SocketService} from '../../services/socket.service';

@Component({
  selector: 'app-active-users',
  templateUrl: './active-users.component.html',
  styleUrls: ['./active-users.component.css']
})
export class ActiveUsersComponent implements OnInit {


  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
  }

  public get listOfActiveUsers(): any {
    return this.socketService.users;
  }
}
