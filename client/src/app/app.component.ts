import {Component, OnInit} from '@angular/core';
import {SocketService} from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'chatAppClient';

  constructor(private socketService: SocketService) {
  }
  ngOnInit(): void {
    if (!sessionStorage.getItem('username')) {
      this.socketService.createUser('user/connect').subscribe(res => {
        sessionStorage.setItem('username', res);
        this.socketService.initializeWebSocketConnection('');
        this.socketService.getActiveUsers(res);
        this.socketService.getUserMessages(sessionStorage.getItem('username'), res);

      });
    } else {
      this.socketService.initializeWebSocketConnection('');
      this.socketService.getActiveUsers(sessionStorage.getItem('username'));
    }
  }
}
