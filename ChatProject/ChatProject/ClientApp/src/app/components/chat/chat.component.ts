import { Component, OnInit } from '@angular/core';
import { ChatingService } from '../../services/chating.service';
import { ChatMessage } from '../../models/chat-message'
import { FormGroup, FormControl } from '@angular/forms';
import { TypeChecker } from 'src/app/services-classes/type-checker';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {

    public inputMessageForm:FormGroup;
    public chatMessages: Array<ChatMessage>;

    constructor(
        private chatingService: ChatingService
    ){
        this.inputMessageForm = new FormGroup({
            textMessage: new FormControl(null)
        });
        this.chatMessages = new Array<ChatMessage>();
    }

    ngOnInit(): void {
        this.chatingService
        .listeningChat()
        .subscribe(
            (message:ChatMessage)=>{
               this.chatMessages.push(message);
            }
        );
    }


    onPush(): void {
        let text = this.inputMessageForm.controls['textMessage'].value;
        if(text && TypeChecker.checkType<string>(text, 'length')){
            this.chatingService
            .pushMessage(text)
            .subscribe(()=>{this.inputMessageForm.reset();}, ()=>console.log('fail'));
        }
    }
}