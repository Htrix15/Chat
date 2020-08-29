import { Injectable } from '@angular/core';
import {HubConnection, HubConnectionBuilder} from '@aspnet/signalr'
import { Observable } from 'rxjs';
import { ChatMessage } from '../models/chat-message'
import { TypeChecker } from '../services-classes/type-checker'

@Injectable()


export class ChatingService {

  private hubConnection: HubConnection;
  constructor() { }

  checkChat():boolean{
    if(this.hubConnection){
      return true;
    }
    return false;
  }

  connectToChat(chatId:string, nick:string):Observable<boolean>{
    return new Observable<boolean>(
      sub => {
        this.hubConnection = new HubConnectionBuilder()
        .withUrl(`/chat/${chatId}/${nick}`).build(); 

        this.hubConnection.start()
        .then(() => {
            this.hubConnection
                .invoke('AddingUserToGroup')
                .then(()=>sub.next(true))
                .catch(()=>sub.error(false));
              }
            )
        .catch(()=>sub.error(false));
      }
    )
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
