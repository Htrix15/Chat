import { Component } from '@angular/core';
import { ChatGroup } from 'src/app/models/chat-group';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { TypeChecker } from 'src/app/services-classes/type-checker';
import { DataShell } from 'src/app/models/data-shell';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})

export class SearchComponent {

    public searchForm: FormGroup;
    public chatGroups: Array<ChatGroup>;
    
    constructor(
        private dataService:DataService, 
    ){
        this.searchForm = new FormGroup({
            groupName: new FormControl(null)
        })
        this.chatGroups = new  Array<ChatGroup>();
    }

    startSearch(){
        let groupName = this.searchForm.controls['groupName'].value;
        if(groupName && TypeChecker.checkType<string>(groupName, 'length')){
            this.dataService.getUserDatas<DataShell>('search-chats', new Map<string,string>().set('groupName',groupName))
            .subscribe(
                (chatGroup:DataShell)=>{
                    if(chatGroup.datas && TypeChecker.checkType<Array<any>>(chatGroup.datas, 'length') && chatGroup.datas.length>0){
                        chatGroup.datas.forEach(
                            ch =>{
                                if(TypeChecker.checkType<ChatGroup>(ch, 'Private')){
                                    this.searchForm.reset();
                                    this.chatGroups.push(ch);
                                }
                            }
                        );
                    } else {
                        this.searchForm.reset();
                        console.log('не найдено')
                    }
                },
                (err: HttpErrorResponse) => this.parsError(err)
            );
        }
    }

    parsError(error: HttpErrorResponse):void{
        if(TypeChecker.checkType<DataShell>(error.error, 'result')){
          console.warn(error.error.errors);
        } else {
          console.error('что-то пошло не так');
        }
    } 
}