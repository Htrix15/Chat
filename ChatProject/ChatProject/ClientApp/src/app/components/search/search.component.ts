import { Component } from '@angular/core';
import { ChatGroup } from 'src/app/models/chat-group';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { TypeChecker } from 'src/app/services-classes/type-checker';
import { DataShell } from 'src/app/models/data-shell';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})

export class SearchComponent {

    public searchForm: FormGroup;
    public chatGroups: Array<ChatGroup>;
    private countSkipChatSearchPositions: number;
    public showPagin: boolean; 

    private groupName: string; 
    private onlyPublic: boolean; 
    private order: string; 
    private orderAsc: boolean; 

    constructor(
        private dataService:DataService
    ){
        this.searchForm = new FormGroup({
            groupName: new FormControl(null),
            onlyPublic: new FormControl(true),
            order: new FormControl("activity"),
            orderAsc: new FormControl(false)
        })
        this.countSkipChatSearchPositions = 0;
        this.showPagin = false;
        this.chatGroups = new Array<ChatGroup>();
    }

    startSearch(){
        this.chatGroups = new Array<ChatGroup>();
        this.groupName = this.searchForm.controls['groupName'].value;
        this.onlyPublic = this.searchForm.controls['onlyPublic'].value;
        this.order = this.searchForm.controls['order'].value;
        this.orderAsc = this.searchForm.controls['orderAsc'].value;
        this.countSkipChatSearchPositions = 0;
        this.preparationqQueryParams(this.countSkipChatSearchPositions, this.groupName, this.onlyPublic, this.order, this.orderAsc);
    }

    continueSearchAndSkip(){
        this.preparationqQueryParams(this.countSkipChatSearchPositions, this.groupName, this.onlyPublic, this.order, this.orderAsc);
    }

    private preparationqQueryParams(skip:number, groupName:string, onlyPublic:boolean, order:string, orderAsc:boolean){
        if(groupName && TypeChecker.checkType<string>(groupName, 'length')){
            let queryParams = new Map<string,string>();
            queryParams.set('groupName',groupName);
            queryParams.set('onlyPublic',String(onlyPublic));
            queryParams.set('skip',skip.toString());
            queryParams.set('take',environment.stepSkipChatSearchPositions.toString());
            if(order){
                queryParams.set('order',order);
                queryParams.set('orderAsc',String(orderAsc));
            }
            this.search(queryParams);
        } else {
            console.error('название пустое');
        }
    }

    private search(queryParams:Map<string,string>){ 
        this.dataService.getUserDatas<DataShell>('search-chats', queryParams)
        .subscribe(
            (chatGroup:DataShell)=>{
                if(chatGroup.datas && TypeChecker.checkType<Array<any>>(chatGroup.datas, 'length') && chatGroup.datas.length>0){
                    let countResult = 0;
                    chatGroup.datas.forEach(
                        ch =>{
                            if(TypeChecker.checkType<ChatGroup>(ch, 'Private')){
                                this.chatGroups.push(ch);
                                countResult++;
                            }
                        }
                    );
                    if(countResult>=environment.stepSkipChatSearchPositions){
                        this.countSkipChatSearchPositions+=environment.stepSkipChatSearchPositions;
                        this.showPagin = true;
                    } else {
                        this.showPagin = false;
                    }
                } else {
                    this.searchForm.reset();
                    console.log('не найдено');
                    this.showPagin = false;
                }
            },
            (err: HttpErrorResponse) => this.parsError(err)
        );
        
    }


    parsError(error: HttpErrorResponse):void{
        if(TypeChecker.checkType<DataShell>(error.error, 'result')){
          console.warn(error.error.errors);
          this.showPagin = false;
        } else {
          console.error('что-то пошло не так');
        }
    } 
}