import { Component, OnInit } from '@angular/core';
import {HubConnection, HubConnectionBuilder} from '@aspnet/signalr'
import { ActivatedRoute } from '@angular/router';
import { ChatingService } from '../../services/chating.service';
import { Observable } from 'rxjs';
import { ChatMessage } from '../../models/chat-message'
@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {

    private chatId: string;


    constructor(
        private route: ActivatedRoute,
        private chatingService: ChatingService) {}

    ngOnInit(): void {
        this.route.params.subscribe((params)=>this.chatId = params.id);
        this.chatingService
        .listeningChat()
        .subscribe((message:ChatMessage)=>console.log(message.nick, message.text));
    }
    
    onPush(): void {
        this.chatingService
        .pushMessage('new message')
        .subscribe(()=>{}, ()=>console.log('fail'));
    }
}