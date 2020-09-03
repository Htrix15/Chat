﻿import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ChatingService } from '../../services/chating.service';
import { ChatMessage } from '../../models/chat-message'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TypeChecker } from 'src/app/services-classes/type-checker';
import { MyValidators } from '../../services-classes/my-validators'
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs/internal/Subscription';
import { MessagesService } from 'src/app/services/messages.service';
import { MyMessage } from 'src/app/services-classes/my-message';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit, OnDestroy {

    public inputMessageForm:FormGroup;
    public chatMessages: Array<ChatMessage>;
    public maxChatTextLength: number;
    public thisChatUrl: string;

    private listeningChatSubscribe: Subscription; 
    private pushMessageSubscribe: Subscription;

    @ViewChild('inputText') inputText: ElementRef
    
    constructor(
        private chatingService: ChatingService,
        private messagesService: MessagesService
    ){
        this.maxChatTextLength = environment.maxChatTextLength;
        this.inputMessageForm = new FormGroup({
            textMessage: new FormControl(null, [MyValidators.validateEmptyText(), Validators.maxLength(this.maxChatTextLength)])
        });
        this.chatMessages = new Array<ChatMessage>();
    }

    ngOnInit(): void {
        this.listeningChatSubscribe = this.chatingService
        .listeningChat()
        .subscribe(
            (message:ChatMessage)=>{
               this.chatMessages.push(message);
            }
        );
        this.thisChatUrl = `https://${location.host}/connect?cg=${this.chatingService.getChatName()}`;
    }

    onPush(): void {
        let text = this.inputMessageForm.controls['textMessage'].value;
        if(text && TypeChecker.checkType<string>(text, 'length')){
            this.pushMessageSubscribe = this.chatingService
            .pushMessage(text)
            .subscribe(()=>{
                this.inputMessageForm.reset();
                (this.inputText.nativeElement as HTMLInputElement).focus();
                }, 
                ()=>this.messagesService.setMessage(new MyMessage('Что-то пошла не так')));
        }
    }

    ngOnDestroy(): void {
         if(this.listeningChatSubscribe){this.listeningChatSubscribe.unsubscribe();}
         if(this.pushMessageSubscribe){this.pushMessageSubscribe.unsubscribe();}
    }
}