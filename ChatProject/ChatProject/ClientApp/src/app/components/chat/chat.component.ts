import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ChatingService } from '../../services/chating.service';
import { ChatMessage } from '../../models/chat-message'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TypeChecker } from 'src/app/services-classes/type-checker';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs/internal/Subscription';
import { MessagesService } from 'src/app/services/messages.service';
import { MyMessage } from 'src/app/services-classes/my-message';
import { MatSnackBar } from '@angular/material/snack-bar';
import {SnackBarComponent} from '../snack-bar/snack-bar.component';
@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit, OnDestroy {

    public inputMessageForm:FormGroup;
    public chatMessages: Array<ChatMessage>;
    public maxChatTextLength: number;
    public chatName: string;
    public thisChatUrl: string;

    private listeningChatSubscribe: Subscription; 
    private pushMessageSubscribe: Subscription;

    @ViewChild('inputText') inputText: ElementRef
    
    constructor(
        private chatingService: ChatingService,
        private messagesService: MessagesService,
        private snackBar: MatSnackBar
    ){
        this.maxChatTextLength = environment.maxChatTextLength;
        this.inputMessageForm = new FormGroup({
            textMessage: new FormControl(null, [Validators.maxLength(this.maxChatTextLength)])
        }); 
        this.chatMessages = new Array<ChatMessage>();
    }

    ngOnInit(): void {
        this.listeningChatSubscribe = this.chatingService
        .listeningChat()
        .subscribe(
            (message:ChatMessage)=>{
               this.chatMessages.push(message);
               setTimeout(() => { 
                   document.scrollingElement.scrollTo(0, document.body.scrollHeight);
                }, 10);
            },
            ()=>{this.parsError();}
        );
        this.chatName = this.chatingService.getChatName();
        this.thisChatUrl = `${location.protocol}//${location.host}/connect?cg=${this.chatName}`;
    }

    onPush(): void {
        let text = this.inputMessageForm.controls['textMessage'].value;
        if( this.inputMessageForm.valid && text && TypeChecker.checkType<string>(text, 'length') && text.trim()){
            this.pushMessageSubscribe = this.chatingService
            .pushMessage(text)
            .subscribe(()=>{
                this.inputMessageForm.reset();
                (this.inputText.nativeElement as HTMLInputElement).focus();
                }, 
                () => this.parsError());
        }
    }

    parsError():void{
        this.snackBar.openFromComponent(SnackBarComponent,
            {duration:5000, data: new MyMessage('Что-то пошла не так - попробуйте перезайти в чат'),  panelClass:'snackBar--error'} );
    } 

    goDown():void{
        document.scrollingElement.scrollTo(0, document.body.scrollHeight);
    }

    ngOnDestroy(): void {
        if(this.listeningChatSubscribe){this.listeningChatSubscribe.unsubscribe();}
        if(this.pushMessageSubscribe){this.pushMessageSubscribe.unsubscribe();}
    }
}