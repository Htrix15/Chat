import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { DataShell } from '../../models/data-shell'
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatGroup } from '../../models/chat-group';
import { ActivatedRoute } from '@angular/router';
import { ChatingService } from '../../services/chating.service';
import { TypeChecker} from '../../services-classes/type-checker'
import { MyValidators } from 'src/app/services-classes/my-validators';
import { Subscription } from 'rxjs/internal/Subscription';
import { MessagesService } from 'src/app/services/messages.service';
import { MyMessage } from 'src/app/services-classes/my-message';
import { MatStep } from '@angular/material/stepper';
@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit, OnDestroy {

  public connectToChatForm: FormGroup;
  public inputPasswordForm: FormGroup;

  public chatName: string;
  public nick: string;
  public privateChat: boolean;

  public chatGroup: ChatGroup;

  private routeSubscribe: Subscription; 
  private getParamsSubscribe: Subscription; 
  private postPasswordSubscribe: Subscription; 

  @ViewChild('stepper') stepper: MatStep;
  @ViewChild('connectStep') connectStep: MatStep;
  @ViewChild('passwordStep') passwordStep: MatStep;
  @ViewChild('checkPasswordStep') checkPasswordStep: MatStep;

  public connectError:boolean;
  public passwordError:boolean;
  public connectErrorText:string;
  public passwordErrorText:string;

  public successConnect:boolean;

  constructor(
    private dataService:DataService, 
    private route: ActivatedRoute,
    private chatingService: ChatingService,
    private messagesService: MessagesService){

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
    this.connectError = false;
    this.successConnect = false;
   
  }

  backToStep(){
    if(this.connectError) {
      this.connectStep.interacted = false;
    }
    if(this.passwordError) {
      this.checkPasswordStep.interacted = false;
    }
  }

  ngOnInit(): void {
    this.routeSubscribe = this.route.queryParams.subscribe(params =>{
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
    this.connectError = false;
    this.successConnect = false;
    
    this.privateChat = false;
    this.connectErrorText = '';
    this.inputPasswordForm.reset();
    this.chatName = this.connectToChatForm.controls['chatName']?.value;
    this.nick = this.connectToChatForm.controls['nick']?.value;
    let saveNick = this.connectToChatForm.controls['rememberMe']?.value;
    
    if(this.chatName && TypeChecker.checkType<string>(this.chatName, 'length') && this.nick && TypeChecker.checkType<string>(this.nick, 'length')){
      this.rememberMe(saveNick);
      this.getParamsSubscribe = this.dataService
      .getUserDatas('check-group-and-nick', new Map<string, string>().set('groupName', this.chatName).set('nick', this.nick))
      .subscribe(
        (chatGroup: DataShell) => {
        if(chatGroup.data && TypeChecker.checkType<ChatGroup>(chatGroup.data, 'Private')){

            this.chatGroup = chatGroup.data;
            this.successConnect = true;
            if(this.chatGroup.Private){
              this.privateChat = true;
              this.connectStep.completed = true;
              this.passwordStep.select();
            } else{
              this.chatingService
              .connectToChat(this.chatGroup.Id.toString(), this.nick, this.chatName);
            }
          }
        }, 
        (err: HttpErrorResponse) => {this.connectError = true; this.parsError(err)});
    }
  }

  checkPassword(): void{
    if(!this.connectError){
      this.passwordError = false;
      this.passwordErrorText = '';
      let password = this.inputPasswordForm.controls['password']?.value;
      if(password && TypeChecker.checkType<string>(password, 'length')){
        this.chatGroup.Password = password;
        this.postPasswordSubscribe = this.dataService.
        postUserDatas<ChatGroup, DataShell>(this.chatGroup, 'check-password').subscribe(
          () => {
            this.chatingService
            .connectToChat(this.chatGroup.Id.toString(), this.nick, this.chatName);
          }, 
          (err: HttpErrorResponse) => {this.passwordError = true; this.parsError(err)}
        );
      }
    }
  }
  
  parsError(error: HttpErrorResponse):void{
    if(TypeChecker.checkType<DataShell>(error.error, 'result')){
      if(this.connectError){
        error.error.errors.forEach(err =>{
          this.connectErrorText+= err +' ';
        })
      }
      
      if(this.passwordError){
        error.error.errors.forEach(err =>{
          this.passwordErrorText+= err +' ';
        })
      }
      
    } else {
      if(this.connectError){
        this.connectErrorText = 'Что-то пошла не так';
      }
      if(this.passwordError){
        this.passwordErrorText = 'Что-то пошла не так';
      }
    }
  } 

  ngOnDestroy(): void {
    if(this.routeSubscribe){this.routeSubscribe.unsubscribe();}
    if(this.getParamsSubscribe){this.getParamsSubscribe.unsubscribe();}
    if(this.postPasswordSubscribe){this.postPasswordSubscribe.unsubscribe();}
  }

}
