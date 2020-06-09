import { Component, OnInit } from '@angular/core';
import {SocketService} from '../../services/socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  username: string;
  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username');
  }
  public get listOfActiveUsers(): any {
    return this.socketService.users;
  }

}
