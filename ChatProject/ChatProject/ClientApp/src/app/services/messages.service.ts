import { Injectable } from '@angular/core';
import { MyMessage } from '../services-classes/my-message'
import { Subject } from 'rxjs';

@Injectable()

export class MessagesService {

  public getMessage$:Subject<MyMessage>; 

  constructor(){
      this.getMessage$ = new Subject<MyMessage>();
  }

  setMessage(message: MyMessage) {
      this.getMessage$.next(message);
  }

}
