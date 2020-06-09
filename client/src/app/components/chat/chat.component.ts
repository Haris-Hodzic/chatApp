import { AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Message } from '../../models/Message';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from '../../services/socket.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  fromUser: string;
  toUser: string;
  form: FormGroup;
  messages: any = [];
  currentTime: Date;
  daysInAWeek: string[];
  months: string[];
  // tslint:disable-next-line:max-line-length
  constructor(private toastr: ToastrService, private socketService: SocketService, private activatedRoute: ActivatedRoute) {
    setInterval(() => {
      this.currentTime = new Date();
    }, 60000);
  }

  ngAfterViewInit(): void {
    if (this.toUser === 'Global') {
      const notification: Message = { message: null, fromUser: this.fromUser, toUser: this.toUser};
      this.socketService.sendMessageUsingSocket(notification);
    }
  }

  public get userTyping(): string {
    return this.socketService.userTyping;
  }
  public get typingToUser(): string {
    return this.socketService.typingToUser;
  }
  public get newMessages(): Message {
    return this.socketService.messages;
  }
  public get typing(): boolean {
    return this.socketService.typing;
  }
  ngOnInit(): void {
    this.socketService.clearMessages(this.toUser);
    this.toUser = this.activatedRoute.snapshot.paramMap.get('user');
    this.fromUser = sessionStorage.getItem('username');
    this.daysInAWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.currentTime = new Date();
    this.form = new FormGroup({
      message: new FormControl(null, [Validators.required])
    });
    this.socketService.getUserMessages(this.fromUser, this.toUser).subscribe(result => {
      this.messages = result;
      this.messages.forEach(message => {
        const time = new Date(message.time);
        if (time.getTime() < (this.currentTime.getTime() + (24 * 60 * 60 * 1000))) {
          message.time = time.getHours() + ':' + time.getMinutes();
        } else if (time.getTime() < (this.currentTime.getTime() + (7 * 24 * 60 * 60 * 1000))) {
          message.time = this.daysInAWeek[time.getDay()];
        } else if (time.getTime() <= (this.currentTime.getTime() + (30 * 24 * 60 * 60 * 1000))) {
          message.time = time.getDate() + ' ' + this.months[time.getMonth()];
        } else if (time.getFullYear() !== this.currentTime.getFullYear()) {
          message.time = this.months[time.getMonth()] + ' ' + time.getFullYear();
        }
      });
    });
  }
  sendTyping() {
    const message: Message = { message: '', fromUser: this.fromUser, toUser: this.toUser};
    this.socketService.sendMessageUsingSocket(message);
  }
  onChange(e) {
    if (!this.typing) {
      this.sendTyping();
      setTimeout(() => {
        this.sendTyping();
      }, 3000);
    }
  }
  sendMessage() {
    if (this.form.valid) {
      // tslint:disable-next-line:max-line-length
      const message: Message = { message: this.form.value.message, fromUser: this.fromUser, toUser: this.toUser};
      this.socketService.sendMessageUsingSocket(message);
    }
  }

  ngOnDestroy(): void {
    this.socketService.clearMessages(this.toUser);
  }
}
