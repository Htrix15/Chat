import { CanDeactivate } from "@angular/router";
import { Observable } from "rxjs";

import { Injectable } from "@angular/core";
import {ChatingService} from "../services/chating.service"

export interface ComponentCanDeactivate {
    canDeactivate: () => Observable<boolean>
  }

@Injectable()
    export class AutoDisconnectedGuard implements CanDeactivate<ComponentCanDeactivate>{
        constructor(private chatingService: ChatingService){
        }
        
    canDeactivate(): Observable<boolean> {
       return this.chatingService.disconnected();
    }
}
