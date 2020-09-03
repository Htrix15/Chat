import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule} from './routing/app-routing.module'
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './services/data.service'
import { ChatingService} from './services/chating.service'
import { SharedModule} from './modules/shared.module'
import { MessagesService } from './services/messages.service'


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [
    DataService,
    ChatingService,
    MessagesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
