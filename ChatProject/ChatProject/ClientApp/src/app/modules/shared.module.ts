import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CommonModule, LocationStrategy, PathLocationStrategy } from "@angular/common";

import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
@NgModule({
  declarations: [ 
  ],
  imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MatCheckboxModule,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
      MatButtonModule,
      MatSelectModule
  ],
  providers:[
      [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
     ],
  exports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MatCheckboxModule,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
      MatButtonModule,
      MatSelectModule
  ]
})
export class SharedModule { }
