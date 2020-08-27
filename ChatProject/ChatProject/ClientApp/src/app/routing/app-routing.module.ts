import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatComponent } from '../components/chat/chat.component';
import { CreateComponent } from '../components/create/create.component';
import { SearchComponent } from '../components/search/search.component';
import { ErrorComponent } from '../components/error/error.component';

const routes: Routes = [
    {
        path: '',  children:[
            {
                path: '', component: CreateComponent
            },
            {
                path: 'chat/:id', component: ChatComponent            
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
        ChatComponent,
        CreateComponent,
        SearchComponent,
        ErrorComponent 
    ],
    imports: [RouterModule.forRoot(routes)],
    providers:[],
    exports: [RouterModule]
  })
export class AppRoutingModule { }
