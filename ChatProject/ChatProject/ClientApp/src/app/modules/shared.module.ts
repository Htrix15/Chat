import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [ 
  ],
  imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
  ],
  providers:[

     ],
  exports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
  ]
})
export class SharedModule { }
