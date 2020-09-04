import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CommonModule, LocationStrategy, PathLocationStrategy } from "@angular/common";

import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatStepperModule} from '@angular/material/stepper';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import {MathRoundPipe} from '../pipes/math-round.pipe'

@NgModule({
  declarations: [ 
    MathRoundPipe
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
      MatSelectModule,
      MatCardModule,
      MatSidenavModule,
      MatExpansionModule,
      MatStepperModule,
      MatProgressSpinnerModule,
      MatTableModule,
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
      MatSelectModule,
      MatCardModule,
      MatSidenavModule,
      MatExpansionModule,
      MatStepperModule,
      MatProgressSpinnerModule,
      MatTableModule,
      MathRoundPipe
  ]
})
export class SharedModule { }
