import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { DataShell } from '../../models/data-shell'
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatGroup } from '../../models/chat-group';
import { ChatingService } from '../../services/chating.service';
import { TypeChecker} from '../../services-classes/type-checker'
import { MyValidators } from 'src/app/services-classes/my-validators';
import { Subscription } from 'rxjs/internal/Subscription';
import { MyMessage } from 'src/app/services-classes/my-message';
import { MessagesService } from 'src/app/services/messages.service';
import { MatStep } from '@angular/material/stepper';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})

export class CreateComponent implements OnInit, OnDestroy{

    public inputChatOptions: FormGroup;

    private chatName: string;
    private nick: string;
    private password: string;
    private chatGroup: ChatGroup;

    private createChatSubscribe: Subscription; 
    private checkNickSubscribe: Subscription; 
    private checkPasswordSubscribe: Subscription; 

    @ViewChild('checkStep') checkStep: MatStep;
    
    public createError:boolean;
    public createErrorText:string;
    public hide:boolean;

    constructor(
        private dataService:DataService, 
        private chatingService: ChatingService,
        private messagesService: MessagesService)
        {
            this.hide = false;
          this.inputChatOptions = new FormGroup({
            chatName: new FormControl(null, 
                [ MyValidators.validateEmptyText(),
                  Validators.pattern('^[а-яА-ЯёЁa-zA-Z0-9 -+=_\?\!\(\)\<\>]{3,30}$')
                ]),
            nick: new FormControl(null,  
                [ MyValidators.validateEmptyText(),
                    Validators.pattern('^[a-zA-Z0-9 -+=_\?\!\(\)\<\>]{3,30}$')
                ]),
            password: new FormControl(null, 
                [ 
                    Validators.pattern('^[a-zA-Z0-9 -+=_\?\!\(\)\<\>]{3,30}$')
                ]),
            rememberMe: new FormControl(true)
        });
    }

    ngOnInit(): void {
        let nick = localStorage.getItem('nick');
        if(nick){
          this.inputChatOptions.controls['nick'].setValue(nick);
          this.inputChatOptions.controls['nick'].markAsTouched();
        }
    }

    backToStep(){
        this.checkStep.interacted = false;
    }

    rememberMe(saveNick: boolean): void{
        if(saveNick){
          localStorage.setItem('nick', this.nick);
        } else {
          localStorage.removeItem('nick');
        }
    }

    checkNickThenCreateAndConnect():void{
        this.createError = false;
        this.nick = this.inputChatOptions.controls['nick']?.value;

        this.checkNickSubscribe = this.dataService
        .getUserDatas('check-nick', new Map<string, string>().set('nick', this.nick))
        .subscribe(
            ()=>{
                let saveNick = this.inputChatOptions.controls['rememberMe']?.value;
                this.rememberMe(saveNick);
                this.createChat();
            },
            (err: HttpErrorResponse) => {
                this.createError = true;
                this.createErrorText ='';
                this.parsError(err);
            }
        );  
    }


    createChat():void{
        this.chatName = this.inputChatOptions.controls['chatName']?.value;
        this.password = this.inputChatOptions.controls['password']?.value;

        if(this.chatName && this.nick &&
        TypeChecker.checkType<string>(this.chatName, 'length') &&
        TypeChecker.checkType<string>(this.nick, 'length')){
            
            let privateChat = (this.password && TypeChecker.checkType<string>(this.password, 'length'))?true:false;
            let newChat = new ChatGroup(1, this.chatName, privateChat, privateChat?this.password:null, 1, 1, new Date())  
            this.createChatSubscribe = this.dataService.
            postUserDatas<ChatGroup, DataShell>(newChat, 'create-chat').subscribe(
                (chatGroup:DataShell)=>{
                    if(chatGroup.data && TypeChecker.checkType<ChatGroup>(chatGroup.data, 'Private')){
                        this.chatGroup = chatGroup.data;
                        this.connectionToChat()
                    }
                },
                (err: HttpErrorResponse) => {
                    this.createError = true;
                    this.createErrorText ='';
                    this.parsError(err);
                }
            );
        } 
    }


    connectionToChat()
    {
        if(!this.chatGroup.Private){
            this.chatingService
            .connectToChat(this.chatGroup.Id.toString(), this.nick, this.chatName);
        } else {
            this.chatGroup.Password = this.password;
            this.checkPasswordSubscribe = this.dataService.
            postUserDatas<ChatGroup, DataShell>(this.chatGroup, 'check-password').subscribe(
                () => {
                this.chatingService
                .connectToChat(this.chatGroup.Id.toString(), this.nick, this.chatName);
                }, 
                (err: HttpErrorResponse) => {
                    this.createError = true;
                    this.createErrorText ='';
                    this.parsError(err);
                }
            );
        }
    }

    parsError(error: HttpErrorResponse):void{
        if(TypeChecker.checkType<DataShell>(error.error, 'result')){
            error.error.errors.forEach(err =>{
                this.createErrorText+= err +' ';
            })    
        } else {
            this.createErrorText = 'Что-то пошла не так';
        }
    } 

    ngOnDestroy(): void {
        if(this.createChatSubscribe){this.createChatSubscribe.unsubscribe();}
        if(this.checkNickSubscribe){this.checkNickSubscribe.unsubscribe();}
        if(this.checkPasswordSubscribe){this.checkPasswordSubscribe.unsubscribe();}
    }
}