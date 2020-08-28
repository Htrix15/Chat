import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { DataShell } from './models/data-shell'
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatGroup } from './models/chat-group';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ClientApp';

  public inputChatNameForm: FormGroup;
  public inputPasswordForm: FormGroup;

  public chatName: string;
  public privateChat: boolean;

  public chatGroup: ChatGroup;

  constructor(
    private dataService:DataService, 
    private router: Router){
      this.inputChatNameForm = new FormGroup({
        chatName: new FormControl(null)
    });

    this.inputPasswordForm = new FormGroup({
      password: new FormControl(null)
    });

    this.privateChat = false;
  }

  ngOnInit(): void {
   
  }

  checkChat(): void{
    let chatName = this.inputChatNameForm.controls['chatName']?.value;
    if(chatName && this.valueIsString(chatName)){
      this.dataService
      .getUserDatas('check-group', new Map<string, string>().set('groupName', chatName))
      .subscribe(
        (chatGroup: DataShell) => {
          if(chatGroup.data && this.dataIsChatGroup(chatGroup.data)){
            this.chatGroup = chatGroup.data;
            if(this.chatGroup.Private){
              this.privateChat = true;
            } else
            {
              this.router.navigate(['/chat',this.chatGroup.Id])
            }
          }
        }, 
        (err: HttpErrorResponse) => this.parsError(err));
    }
  }

  checkPassword(): void{
    let password = this.inputPasswordForm.controls['password']?.value;
    if(password && this.valueIsString(password)){
      this.chatGroup.Password = password;
      this.dataService.postUserDatas<ChatGroup, DataShell>(this.chatGroup, 'check-password').subscribe(
        () => {
          this.router.navigate(['/chat',this.chatGroup.Id])
        }, 
        (err: HttpErrorResponse) => this.parsError(err)
      );
    }
  }

  private dataIsChatGroup(data: any): data is ChatGroup {
    return (<ChatGroup>data).Private !== void 0;
  }

  private valueIsString(value: any): value is string {
    return (<string>value).length !== void 0;
  }

  private errorIsDataShell(error: any): error is DataShell {
    return (<DataShell>error).result !== void 0;
  }

  parsError(error: HttpErrorResponse):void{
    if(this.errorIsDataShell(error.error)){
      console.warn(error.error.errors);
    } else {
      console.error('что-то пошло не так');
    }
  }

 
    
}
