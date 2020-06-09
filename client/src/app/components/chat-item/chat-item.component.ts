import {Component, Input, OnInit} from '@angular/core';
import {SocketService} from '../../services/socket.service';

@Component({
  selector: 'app-chat-item',
  templateUrl: './chat-item.component.html',
  styleUrls: ['./chat-item.component.css']
})
export class ChatItemComponent implements OnInit {

  @Input()
  username: string;
  @Input()
  page: string;
  messages: any = [];
  lastMessage: any;
  currentTime: Date;
  daysInAWeek: string[];
  months: string[];
  minuteAfterNow: number;
  constructor(private socketService: SocketService) {
    setInterval(() => {
      this.currentTime = new Date();
      this.minuteAfterNow = this.currentTime.getTime() + (60 * 1000);
    }, 60000);
  }

  public get listOfUserslastMessages(): any {
    return this.socketService.listOfLastUsersMessages;
  }
  ngOnInit(): void {
    this.daysInAWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.currentTime = new Date();
    this.minuteAfterNow = this.currentTime.getTime();
    this.socketService.getUserMessages(sessionStorage.getItem('username'), this.username).subscribe(result => {
      this.messages = result;
      if (this.messages.length !== 0) {
        // tslint:disable-next-line:triple-equals
        this.lastMessage = this.messages[this.messages.length - 1];
        const time = new Date(this.lastMessage.time);
        if (time.getTime() < (this.currentTime.getTime() + (24 * 60 * 60 * 1000))) {
          this.lastMessage.time = time.getHours() + ':' + time.getMinutes();
        } else if (time.getTime() < (this.currentTime.getTime() + (7 * 24 * 60 * 60 * 1000))) {
          this.lastMessage.time = this.daysInAWeek[time.getDay()];
        } else if (time.getTime() <= (this.currentTime.getTime() + (30 * 24 * 60 * 60 * 1000))) {
          this.lastMessage.time = time.getDate() + ' ' + this.months[time.getMonth()];
        } else if (time.getFullYear() !== this.currentTime.getFullYear()) {
          this.lastMessage.time = this.months[time.getMonth()] + ' ' + time.getFullYear();
        }
      }
    });
  }
}
