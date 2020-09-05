import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ChatGroup } from 'src/app/models/chat-group';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { TypeChecker } from 'src/app/services-classes/type-checker';
import { DataShell } from 'src/app/models/data-shell';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MyValidators } from 'src/app/services-classes/my-validators';
import { Subscription } from 'rxjs/internal/Subscription';
import { MyMessage } from 'src/app/services-classes/my-message';
import { MessagesService } from 'src/app/services/messages.service';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackBarComponent} from '../snack-bar/snack-bar.component'
@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnDestroy{

    public searchForm: FormGroup;
    public chatGroups: Array<ChatGroup>;
    private countSkipChatSearchPositions: number;
    public showPagin: boolean; 
    public endSearch: boolean;

    private groupName: string; 
    private onlyPublic: boolean; 
    private order: string; 
    private orderAsc: boolean; 

    private searchChatesSubscribe: Subscription; 

    public displayedColumns: Array<string>;

    @ViewChild('resultTable') resultTable: MatTable<ChatGroup>

    
    constructor(
        private dataService:DataService,
        private messagesService: MessagesService,
        private router: Router,
        private snackBar: MatSnackBar
    ){
        this.searchForm = new FormGroup({
            groupName: new FormControl(null, 
                [   MyValidators.validateEmptyText(),
                    Validators.pattern('^[а-яА-ЯёЁa-zA-Z0-9 -+=_\?\!\(\)\<\>]{3,30}$')
                ]),
            onlyPublic: new FormControl(true),
            order: new FormControl("activity"),
            orderAsc: new FormControl(false)
        });
        this.countSkipChatSearchPositions = 0;
        this.showPagin = false;
        this.chatGroups = new Array<ChatGroup>();
        this.displayedColumns = ['Name', 'Private', 'CountUser', 'Activities', 'DataCreate']
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
        console.log(this.resultTable);
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
            this.messagesService.setMessage(new MyMessage('Пустое название чата', false));
        }
    }

    private search(queryParams:Map<string,string>){ 
        this.endSearch = false;
        this.searchChatesSubscribe = this.dataService
        .getUserDatas<DataShell>('search-chats', queryParams)
        .subscribe(
            (chatGroup:DataShell)=>{
                this.endSearch = true;
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
                    this.resultTable.renderRows();
                    if(countResult>=environment.stepSkipChatSearchPositions){
                        this.countSkipChatSearchPositions+=environment.stepSkipChatSearchPositions;
                        this.showPagin = true;
                    } else {
                        this.showPagin = false;
                    }
                
                } else {
                    this.searchForm.reset();
                    this.messagesService.setMessage(new MyMessage('Ничего не найдено', false));
                    this.showPagin = false;
                }
            },
            (err: HttpErrorResponse) => this.parsError(err)
        );
        
    }


    parsError(error: HttpErrorResponse):void{
        this.endSearch = true;
        let searchErrorText ="";
    
        if(TypeChecker.checkType<DataShell>(error.error, 'result')){
            error.error.errors.forEach(err =>{
                searchErrorText+= err +' ';
            }) 
            let message =new MyMessage(searchErrorText);
            this.snackBar.openFromComponent(SnackBarComponent,
                {duration:5000, data: message, panelClass: message.error?'snackBar--error':'snackBar'} );
        } else {
            this.snackBar.openFromComponent(SnackBarComponent,
                {duration:5000, data: new MyMessage('Что-то пошла не так'),  panelClass:'snackBar--error'} );

        }
        this.showPagin = false;
    } 

    goConnectToChat(chatName:string){
        this.router.navigate(['/connect'], { queryParams: { cg: chatName }});
    }

    ngOnDestroy(): void {
       if(this.searchChatesSubscribe){this.searchChatesSubscribe.unsubscribe();}
    }
}