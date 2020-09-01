import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { DataShell } from '../../models/data-shell'
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatGroup } from '../../models/chat-group';
import { Router } from '@angular/router';
import { ChatingService } from '../../services/chating.service';
import { TypeChecker} from '../../services-classes/type-checker'
import { MyValidators } from 'src/app/services-classes/my-validators';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})

export class CreateComponent {

    public inputChatOptions: FormGroup;
    public chatNotCreated:boolean;
    private chatName: string;
    private nick: string;
    private password: string;
    private chatGroup: ChatGroup;

    constructor(
        private dataService:DataService, 
        private chatingService: ChatingService){
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
                ])
        });
        this.chatNotCreated = true;
    }

    createChat():void{

        this.chatName = this.inputChatOptions.controls['chatName']?.value;
        this.nick = this.inputChatOptions.controls['nick']?.value;
        this.password = this.inputChatOptions.controls['password']?.value;

        if(this.chatNotCreated){
            if(this.chatName && this.nick &&
            TypeChecker.checkType<string>(this.chatName, 'length') &&
            TypeChecker.checkType<string>(this.nick, 'length')){
                
                let privateChat = (this.password && TypeChecker.checkType<string>(this.password, 'length'))?true:false;
                let newChat = new ChatGroup(1, this.chatName, privateChat, privateChat?this.password:null, 1, 1, new Date())  
                
                this.dataService.postUserDatas<ChatGroup, DataShell>(newChat, 'create-chat').subscribe(
                    (chatGroup:DataShell)=>{
                        if(chatGroup.data && TypeChecker.checkType<ChatGroup>(chatGroup.data, 'Private')){
                            this.chatNotCreated = false;
                            this.chatGroup = chatGroup.data;
                            this.checkNick(this.chatGroup, this.nick, this.password);
                        }
                    },
                    (err: HttpErrorResponse) => this.parsError(err)
                );
            } 
        } else {
            this.checkNick(this.chatGroup, this.nick, this.password);
        }
    }

    checkNick(chatGroup:ChatGroup, 
        nick:string, 
        password: string, 
        ){
            this.dataService
            .getUserDatas('check-nick', new Map<string, string>().set('nick', nick))
            .subscribe(
                ()=>{
                    this.connectionPreparation(chatGroup, nick, password);
                },
                (err: HttpErrorResponse) => this.parsError(err)
            );  
    }

    connectionPreparation(chatGroup:ChatGroup, 
        nick:string, 
        password: string
        ){
            if(!chatGroup.Private){
                this.chatingService
                .connectToChat(chatGroup.Id.toString(), nick);
            } else {
                chatGroup.Password = password;
                this.dataService.postUserDatas<ChatGroup, DataShell>(chatGroup, 'check-password').subscribe(
                    () => {
                    this.chatingService
                    .connectToChat(chatGroup.Id.toString(), nick);
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