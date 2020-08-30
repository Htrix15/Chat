import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { DataShell } from './models/data-shell'
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatGroup } from './models/chat-group';
import { Router } from '@angular/router';
import { ChatingService } from './services/chating.service';
import { TypeChecker} from './services-classes/type-checker'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ClientApp';

  constructor(){}
  ngOnInit(): void { }

}
