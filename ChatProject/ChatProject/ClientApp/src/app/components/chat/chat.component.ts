import { Component, OnInit } from '@angular/core';
import {HubConnection, HubConnectionBuilder} from '@aspnet/signalr'
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {

    private hubConnection: HubConnection;
    private chatId: string;

    constructor(private route: ActivatedRoute) {
      
    }

    ngOnInit(): void {
        this.route.params.subscribe((params)=>this.chatId = params.id);
    }

    ngAfterViewInit(): void {
        this.hubConnection = new HubConnectionBuilder()
        .withUrl(`/chat/${this.chatId}`).build(); 

        this.hubConnection.start()
            .then(() => {
                console.log('connection success')
                this.hubConnection
                    .invoke('Entrance', 'Вася')
                    .catch(err => console.error(err));})
            .catch(() => console.error('connection failed'));

        this.hubConnection.on('SendToAll', (message: string) => {
            console.log(message);
        });

      

    }
    
    onPush(): void {
        this.hubConnection
            .invoke('SendToAll', 'new message')
            .catch(err => console.error(err));
    }
}