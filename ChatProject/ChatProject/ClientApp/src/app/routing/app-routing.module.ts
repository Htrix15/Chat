import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatComponent } from '../components/chat/chat.component';
import { CreateComponent } from '../components/create/create.component';
import { SearchComponent } from '../components/search/search.component';
import { ErrorComponent } from '../components/error/error.component';
import { ConnectComponent } from '../components/connect/connect.component';

import {ConnectToChatGuard} from '../guards/connect-to-chat.guard'
import { SharedModule } from '../modules/shared.module';

const routes: Routes = [
    {
        path: '',  children:[
            {
                path: '', component: ConnectComponent
            },
            {
                path: 'connect', component: ConnectComponent
            },
            {
                path: 'chat/:id', component: ChatComponent, canActivate: [ConnectToChatGuard]            
            },
            {
                path: 'create', component: CreateComponent
            },
            {
                path: 'search', component: SearchComponent
            },
            {
                path: 'error', component: ErrorComponent 
            },
            {
               path: '**', redirectTo: 'error'
            }
        ]
    }
]
@NgModule({
    declarations: [ 
        ConnectComponent,
        ChatComponent,
        CreateComponent,
        SearchComponent,
        ErrorComponent 
    ],
    imports: [RouterModule.forRoot(routes),  SharedModule],
    providers:[ConnectToChatGuard],
    exports: [RouterModule]
  })
export class AppRoutingModule { }
