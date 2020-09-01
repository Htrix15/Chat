import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { DataShell } from '../../models/data-shell'
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatGroup } from '../../models/chat-group';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatingService } from '../../services/chating.service';
import { TypeChecker} from '../../services-classes/type-checker'
import { MyValidators } from 'src/app/services-classes/my-validators';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit {

  public connectToChatForm: FormGroup;
  public inputPasswordForm: FormGroup;

  public chatName: string;
  public nick: string;
  public privateChat: boolean;

  public chatGroup: ChatGroup;

  constructor(
    private dataService:DataService, 
    private route: ActivatedRoute,
    private router: Router,
    private chatingService: ChatingService){

    this.connectToChatForm = new FormGroup({
        chatName: new FormControl(null, 
          [ MyValidators.validateEmptyText(),
            Validators.pattern('^[а-яА-ЯёЁa-zA-Z0-9 -+=_\?\!\(\)\<\>]{3,30}$')
          ]),
        nick: new FormControl(null,  
          [ MyValidators.validateEmptyText(),
            Validators.pattern('^[a-zA-Z0-9 -+=_\?\!\(\)\<\>]{3,30}$')
          ]),
        rememberMe: new FormControl(true)
    });

    this.inputPasswordForm = new FormGroup({
      password: new FormControl(null, 
        [ MyValidators.validateEmptyText(),
          Validators.pattern('^[a-zA-Z0-9 -+=_\?\!\(\)\<\>]{3,30}$')
        ])
    });

    this.privateChat = false;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params =>{
      if(params['cg']){
       this.connectToChatForm.controls['chatName'].setValue(params['cg']);
       this.connectToChatForm.controls['chatName'].markAsTouched();
      }
    })
    let nick = localStorage.getItem('nick');
    if(nick){
      this.connectToChatForm.controls['nick'].setValue(nick);
      this.connectToChatForm.controls['nick'].markAsTouched();
    }
  }
  
  rememberMe(saveNick: boolean): void{
    if(saveNick){
      localStorage.setItem('nick', this.nick);
    } else {
      localStorage.removeItem('nick');
    }
  }



  connectToChat(): void{
    this.chatName = this.connectToChatForm.controls['chatName']?.value;
    this.nick = this.connectToChatForm.controls['nick']?.value;
    let saveNick = this.connectToChatForm.controls['rememberMe']?.value;
    
    if(this.chatName && TypeChecker.checkType<string>(this.chatName, 'length') && this.nick && TypeChecker.checkType<string>(this.nick, 'length')){
      this.rememberMe(saveNick);
      this.dataService
      .getUserDatas('check-group-and-nick', new Map<string, string>().set('groupName', this.chatName).set('nick', this.nick))
      .subscribe(
        (chatGroup: DataShell) => {
        if(chatGroup.data && TypeChecker.checkType<ChatGroup>(chatGroup.data, 'Private')){
            this.chatGroup = chatGroup.data;
            if(this.chatGroup.Private){
              this.privateChat = true;
            } else{
              this.chatingService
              .connectToChat(this.chatGroup.Id.toString(), this.nick, this.chatName);
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
          .connectToChat(this.chatGroup.Id.toString(), this.nick, this.chatName);
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
