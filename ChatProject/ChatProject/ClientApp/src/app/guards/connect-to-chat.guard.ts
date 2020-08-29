import { CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";

import { Injectable } from "@angular/core";
import {ChatingService} from "../services/chating.service"

@Injectable()
export class ConnectToChatGuard implements CanActivate{
    private guard:Observable<boolean>;

    constructor(private chatingService: ChatingService, private router: Router ) { 
        this.guard = new Observable<boolean>
          ((observer) => {
              if(chatingService.checkChat()){
                observer.next(true);
              }
              else {
                this.router.navigate(['error']);
              }
          });
        }

    canActivate(): Observable<boolean> {
        return this.guard;
    }
    
}