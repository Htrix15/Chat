import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { DataShell } from './models/data-shell'
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatGroup } from './models/chat-group';
import { Router } from '@angular/router';
import { ChatingService } from './services/chating.service';
import { TypeChecker} from './services-classes/type-checker'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ClientApp';

  public inputChatNameForm: FormGroup;
  public inputNickForm: FormGroup;
  public inputPasswordForm: FormGroup;

  public chatName: string;
  public nick: string;
  public privateChat: boolean;

  public chatGroup: ChatGroup;

  constructor(
    private dataService:DataService, 
    private router: Router,
    private chatingService: ChatingService){
      this.inputChatNameForm = new FormGroup({
        chatName: new FormControl(null)
    });

    this.inputPasswordForm = new FormGroup({
      password: new FormControl(null)
    });

    this.inputNickForm = new FormGroup({
      nick: new FormControl(null)
    });

    this.privateChat = false;
  }

  ngOnInit(): void {
  }

  connectToChat(): void{

    let chatName = this.inputChatNameForm.controls['chatName']?.value;
    this.nick = this.inputNickForm.controls['nick']?.value;
    if(chatName && TypeChecker.checkType<string>(chatName, 'length') && this.nick && TypeChecker.checkType<string>(this.nick, 'length')){
      this.dataService
      .getUserDatas('check-group-and-nick', new Map<string, string>().set('groupName', chatName).set('nick', this.nick))
      .subscribe(
        (chatGroup: DataShell) => {
        if(chatGroup.data && TypeChecker.checkType<ChatGroup>(chatGroup.data, 'Private')){
            this.chatGroup = chatGroup.data;
            if(this.chatGroup.Private){
              this.privateChat = true;
            } else{
              this.chatingService
              .connectToChat(this.chatGroup.Name, this.nick)
              .subscribe(
                () => {
                  console.log('connection success');
                  this.router.navigate(['/chat',this.chatGroup.Id])},
                () => console.log('connection failed'))
            }
          }
        }, 
        (err: HttpErrorResponse) => this.parsError(err));
    }
  }

  checkPassword(): void{
    let password = this.inputPasswordForm.controls['password']?.value;
    if(password && TypeChecker.checkType<string>(password, 'length')){
      this.chatGroup.Password = password;
      this.dataService.postUserDatas<ChatGroup, DataShell>(this.chatGroup, 'check-password').subscribe(
        () => {
          this.chatingService
          .connectToChat(this.chatGroup.Name, this.nick)
          .subscribe(
            () => {
              console.log('connection success');
              this.router.navigate(['/chat',this.chatGroup.Id])},
            () => console.log('connection failed'))
        }, 
        (err: HttpErrorResponse) => this.parsError(err)
      );
    }
  }
  parsError(error: HttpErrorResponse):void{
    if(TypeChecker.checkType<DataShell>(error.error, 'result')){
      console.warn(error.error.errors);
    } else {
      console.error('что-то пошло не так');
    }
  } 
}
