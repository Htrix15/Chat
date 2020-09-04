import { Injectable } from '@angular/core';
import {HubConnection, HubConnectionBuilder} from '@aspnet/signalr'
import { Observable } from 'rxjs';
import { ChatMessage } from '../models/chat-message'
import { Router } from '@angular/router';

@Injectable()


export class ChatingService {

  private hubConnection: HubConnection;
  private chatName: string;

  constructor(private router: Router) { }

  checkChat():boolean{
    if(this.hubConnection){
      return true;
    }
    return false;
  }
  
  getChatName():string{
    return this.chatName;
  }

  connectToChat(chatId:string, nick:string, chatName: string):void{
    new Observable<boolean>(
      sub => {
        this.hubConnection = new HubConnectionBuilder()
        .withUrl(`/chat/${chatId}/${nick}`).build(); 

        this.hubConnection.start()
        .then(() => {
          this.chatName = chatName;
          this.hubConnection
              .invoke('AddingUserToGroup')
              .then(()=>sub.next(true))
              .catch(()=>sub.error(false));
            }
          )
        .catch(()=>sub.error(false));
      }
    ).subscribe(
      () => {
          console.log('connection success');
          this.router.navigate(['/chat',chatId])},
      () => console.log('connection failed'))
  }
  
  disconnected():Observable<boolean>{
    return new Observable<boolean>(
      sub => {
        this.hubConnection.stop() 
        .then(this.hubConnection = null)
        .then(()=>sub.next(true))
        .catch(()=>sub.error(false));
    })
  }

  listeningChat():Observable<ChatMessage>{
    return new Observable<ChatMessage>(
      sub => {
        this.hubConnection.on('SendToAll', 
        (message: ChatMessage ) => {
            sub.next(message)}
        );
      }
    );
  }

  pushMessage(message:string):Observable<boolean>{
    return new Observable<boolean>(
      sub => {
        this.hubConnection
        .invoke('SendToAll', message)
        .then(()=>sub.next(true))
        .catch(()=>sub.error(false));}
      )
  }



}
