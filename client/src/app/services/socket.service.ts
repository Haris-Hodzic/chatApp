import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {ToastrService} from 'ngx-toastr';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class SocketService {
  isLoaded = false;
  isCustomSocketOpened = false;
  private stompClient;
  messages: any = [];
  listOfLastUsersMessages: any = [];
  users = new Set();
  activeUsers: any = [];
  time: Date;
  userTyping: string;
  typingToUser: string;
  typing: boolean;
  constructor(private toastr: ToastrService, private http: HttpClient) {}
  clearMessages(username: string) {
    this.messages = [];
    this.listOfLastUsersMessages[username] = undefined;
  }
  getUserMessages(fromUser: string, toUser: string) {
    return this.http.get('/api/user/messages?fromUser=' + fromUser + '&toUser=' + toUser)
      .pipe(
        catchError(this.handleError)
      );
  }
  createUser(path: string) {
    return this.http.post(path, '', {responseType: 'text'})
      .pipe(
        catchError(this.handleError)
      );
  }
  initializeWebSocketConnection(username: string) {
    const ws = new SockJS('/ws');
    this.stompClient = Stomp.over(ws);
    const that = this;
    if (!this.isLoaded) {
      // tslint:disable-next-line:only-arrow-functions
      this.stompClient.connect({}, function(frame) {
        that.isLoaded = true;
        that.openGlobalSocket();
        that.openSocket(sessionStorage.getItem('username'));
      });
    }
  }
  getActiveUsers(username: string){
    return this.http.get('/user/active?userName=' + username)
      .pipe(
        catchError(this.handleError)
      ).subscribe(res => {
        this.activeUsers = res;
        this.activeUsers.forEach(user => {
          this.users.add(user.name);
        });
      });
  }
  sendMessageUsingSocket(message) {
    this.stompClient.send('/app/send/message', {}, JSON.stringify(message));
  }
  openGlobalSocket() {
    this.stompClient.subscribe('/topic', (message) => {
      this.handleResult(message);
    });
    this.stompClient.send('/app/chat.addUser',
      {},
      JSON.stringify({name: sessionStorage.getItem('username')})
    );
  }
  openSocket(fromUser: string) {
    if (this.isLoaded) {
      this.isCustomSocketOpened = true;
      this.stompClient.subscribe('/topic/' + fromUser,  message => {
        this.handleResult(message);
      });
    }
  }
  handleResult(message){
    if (message.body) {
      const messageResult: any = JSON.parse(message.body);
      if ('name' in messageResult) {
        if (messageResult.id !== 0 && messageResult.name !== sessionStorage.getItem('username')) {
          this.users.add(messageResult.name);
        } else if (messageResult.id === 0) {
          this.users.delete(messageResult.name);
        }
      } else if (messageResult.message === '') {
        if (this.typing) {
          this.typing = false;
        } else {
          this.typing = true;
          this.userTyping = messageResult.fromUser;
          this.typingToUser = messageResult.toUser;
        }
      } else {
        this.time = new Date(messageResult.time);
        this.time.setHours(this.time.getHours(), this.time.getMinutes() + 1);
        messageResult.time = this.time;
        if (messageResult.toUser !== 'Global') {
          this.listOfLastUsersMessages[messageResult.fromUser] = messageResult;
          this.messages.push(messageResult);
        } else {
          if (!messageResult.message) {
            this.toastr.success('<h2 class="notification">' + messageResult.fromUser + ' joined Global chat</h2>', null, {
              timeOut: 3000,
              enableHtml: true
            });
          } else {
            this.messages.push(messageResult);
            this.listOfLastUsersMessages[messageResult.toUser] = messageResult;
          }
        }
      }
    }
  }
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
