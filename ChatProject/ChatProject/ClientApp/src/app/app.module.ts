import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule} from './routing/app-routing.module'
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './services/data.service'
import { ChatingService} from './services/chating.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    DataService,
    ChatingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
